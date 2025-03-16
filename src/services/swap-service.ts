import { swapInstructions } from '@orca-so/whirlpools';
import { initializeOrcaSDK } from '../config/orca-config';
import { POOLS, TOKENS, DEFAULT_SLIPPAGE_TOLERANCE } from '../utils/constants';
// import {sendTransaction} from "@orca-so/tx-sender";
import {
    getSetComputeUnitLimitInstruction,
    getSetComputeUnitPriceInstruction
} from '@solana-program/compute-budget';
import {
    createSolanaRpc,
    address,
    pipe,
    createTransactionMessage,
    setTransactionMessageFeePayer,
    setTransactionMessageLifetimeUsingBlockhash,
    appendTransactionMessageInstructions,
    prependTransactionMessageInstructions,
    signTransactionMessageWithSigners,
    getComputeUnitEstimateForTransactionMessageFactory,
    getBase64EncodedWireTransaction,
    setTransactionMessageFeePayerSigner, RpcMainnet
} from '@solana/kit';

// Define the return type explicitly for clarity
interface SwapResult {
    success: boolean;
    inputAmount: number;
    estimatedOutputAmount: number;
    transactionId?: string;  // Make this optional
    actualOutputAmount?: number; // Make this optional
}

export class SwapService {
    /**
     * Swap USDC for SOL
     * @param inputAmount Amount of USDC to swap
     * @returns Object containing transaction details
     */
    async swapUsdcForSol(inputAmount: bigint): Promise<SwapResult> {


        try {
            // Initialize Orca SDK
            const { wallet, rpc } = await initializeOrcaSDK();

            // Get swap instructions
            const { instructions, quote } = await swapInstructions(
                rpc,
                { inputAmount, mint: TOKENS.SOL },
                POOLS.SOL_USDC,
                DEFAULT_SLIPPAGE_TOLERANCE,
                wallet
            );

            // In a real implementation, you would submit the transaction here
            // For this example, we'll just return the quote
            console.log(`Quote estimated SOL out: ${quote.tokenEstOut}`);
            console.log(`Number of instructions: ${instructions.length}`);
            const latestBlockHash = await rpc.getLatestBlockhash().send();


            const transactionMessage = await pipe(
                createTransactionMessage({version: 0}),
                tx => setTransactionMessageFeePayer(wallet.address, tx),
                tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockHash.value, tx),
                tx => appendTransactionMessageInstructions(instructions, tx)
            )


            const getComputeUnitEstimateForTransactionMessage =
                getComputeUnitEstimateForTransactionMessageFactory({
                    rpc
                });

            const computeUnitEstimate = await getComputeUnitEstimateForTransactionMessage(transactionMessage) + 100_000;

            const medianPrioritizationFee = await rpc.getRecentPrioritizationFees()
                .send()
                .then(fees =>
                    fees
                        .map(fee => Number(fee.prioritizationFee))
                        .sort((a, b) => a - b)
                        [Math.floor(fees.length / 2)]
                );

            const transactionMessageWithComputeUnitInstructions = await prependTransactionMessageInstructions([
                getSetComputeUnitLimitInstruction({units: computeUnitEstimate}),
                getSetComputeUnitPriceInstruction({microLamports: medianPrioritizationFee})
            ], transactionMessage);




            const signedTransaction = await signTransactionMessageWithSigners(transactionMessageWithComputeUnitInstructions)

            const base64EncodedWireTransaction = getBase64EncodedWireTransaction(signedTransaction);

            const timeoutMs = 90000;
            const startTime = Date.now();

            while (Date.now() - startTime < timeoutMs) {
                const transactionStartTime = Date.now();

                const signature = await rpc.sendTransaction(base64EncodedWireTransaction, {
                    maxRetries: 0n,
                    skipPreflight: true,
                    encoding: 'base64'
                }).send();

                const statuses = await rpc.getSignatureStatuses([signature]).send();
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

            console.log("Here")

            return {
                success: true,
                inputAmount: Number(inputAmount),
                estimatedOutputAmount: Number(quote.tokenEstOut),
                transactionId: undefined, // In a real implementation, this would be set
                actualOutputAmount: undefined // In a real implementation, this would be set
            };
        } catch (error) {
            console.error('Error swapping USDC for SOL:', error);
            return {
                success: false,
                inputAmount: Number(inputAmount),
                estimatedOutputAmount: Number(0),
                transactionId: undefined, // In a real implementation, this would be set
                actualOutputAmount: undefined // In a real implementation, this would be set
            };
        }
    }


}
