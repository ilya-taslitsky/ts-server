import {swapInstructions} from '@orca-so/whirlpools';
import {initializeOrcaSDK} from '../config/orca-config';
import {config} from '../config';
import {getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction} from '@solana-program/compute-budget';
import {
    address,
    appendTransactionMessageInstructions,
    createTransactionMessage,
    getBase64EncodedWireTransaction,
    getComputeUnitEstimateForTransactionMessageFactory,
    pipe,
    prependTransactionMessageInstructions,
    setTransactionMessageFeePayer,
    setTransactionMessageLifetimeUsingBlockhash, Signature,
    signTransactionMessageWithSigners
} from '@solana/kit';
import {SwapReqDto} from "../models/swap-req-dto";
import {SwapRespDto} from "../models/swap-resp-dto";

export class SwapService {
    async swap(req: SwapReqDto): Promise<SwapRespDto> {
        const inputAmount = BigInt(req.amount);
        const mint = address(req.token);
        const poolAddress = address(req.poolAddress);
        const slippage = req.slippage || config.swap.defaultSlippageBps;

        try {
            // Initialize Orca SDK
            const {wallet, rpc} = await initializeOrcaSDK();

            // Get swap instructions
            const {instructions, quote} = await swapInstructions(
                rpc,
                {inputAmount, mint},
                poolAddress,
                slippage,
                wallet
            );

            console.log(`Quote estimated SOL out: ${quote.tokenEstOut}`);
            console.log(`Number of instructions: ${instructions.length}`);
            const latestBlockHash = await rpc.getLatestBlockhash().send();


            const transactionMessage = pipe(
                createTransactionMessage({version: 0}),
                tx => setTransactionMessageFeePayer(wallet.address, tx),
                tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockHash.value, tx),
                tx => appendTransactionMessageInstructions(instructions, tx)
            )


            const getComputeUnitEstimateForTransactionMessage =
                getComputeUnitEstimateForTransactionMessageFactory({
                    rpc
                });

            const computeUnitEstimate =
                await getComputeUnitEstimateForTransactionMessage(transactionMessage) + 100_000;

            const medianPrioritizationFee =
                await rpc.getRecentPrioritizationFees()
                    .send()
                    .then(fees =>
                        fees
                            .map(fee => Number(fee.prioritizationFee))
                            .sort((a, b) => a - b)
                            [Math.floor(fees.length / 2)]
                    );

            const transactionMessageWithComputeUnitInstructions =
                prependTransactionMessageInstructions([
                    getSetComputeUnitLimitInstruction({units: computeUnitEstimate}),
                    getSetComputeUnitPriceInstruction({microLamports: medianPrioritizationFee})
                ], transactionMessage);


            const signedTransaction =
                await signTransactionMessageWithSigners(transactionMessageWithComputeUnitInstructions)

            const base64EncodedWireTransaction =
                getBase64EncodedWireTransaction(signedTransaction);

            const timeoutMs = 90000;
            const startTime = Date.now();

            let signature: Signature | undefined;

            while (Date.now() - startTime < timeoutMs) {
                const transactionStartTime = Date.now();

                signature = await rpc.sendTransaction(base64EncodedWireTransaction, {
                    maxRetries: 0n,
                    skipPreflight: true,
                    encoding: 'base64'
                }).send();

                const statuses =
                    await rpc.getSignatureStatuses([signature]).send();
                if (statuses.value[0]) {
                    if (!statuses.value[0].err) {
                        console.log(`Transaction confirmed: ${signature}`);
                        break;
                    } else {
                        console.error(`Transaction failed: ${statuses.value[0].err.toString()}`);
                        break;
                    }
                }

                const elapsedTime = Date.now() - transactionStartTime;
                const remainingTime = Math.max(0, 1000 - elapsedTime);
                if (remainingTime > 0) {
                    await new Promise(resolve => setTimeout(resolve, remainingTime));
                }
            }

            // Check if signature was set
            if (!signature) {
                return {
                    success: false,
                    inputAmount: Number(inputAmount),
                    estimatedOutputAmount: Number(quote.tokenEstOut),
                    transactionId: undefined,
                    actualOutputAmount: undefined,
                    error: "Transaction timed out without receiving signature"
                };
            }

            return {
                success: true,
                inputAmount: Number(inputAmount),
                estimatedOutputAmount: Number(quote.tokenEstOut),
                transactionId: signature,
                actualOutputAmount: undefined
            };
        } catch (error) {
            console.error('Error swapping USDC for SOL:', error);
            return {
                success: false,
                inputAmount: Number(inputAmount),
                estimatedOutputAmount: Number(0),
                transactionId: undefined, // In a real implementation, this would be set
                actualOutputAmount: undefined, // In a real implementation, this would be set
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}