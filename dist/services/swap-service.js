"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapService = void 0;
const whirlpools_1 = require("@orca-so/whirlpools");
const orca_config_1 = require("../config/orca-config");
const constants_1 = require("../utils/constants");
// import {sendTransaction} from "@orca-so/tx-sender";
const compute_budget_1 = require("@solana-program/compute-budget");
const kit_1 = require("@solana/kit");
class SwapService {
    /**
     * Swap USDC for SOL
     * @param inputAmount Amount of USDC to swap
     * @returns Object containing transaction details
     */
    async swapUsdcForSol(inputAmount) {
        try {
            // Initialize Orca SDK
            const { wallet, rpc } = await (0, orca_config_1.initializeOrcaSDK)();
            // Get swap instructions
            const { instructions, quote } = await (0, whirlpools_1.swapInstructions)(rpc, { inputAmount, mint: constants_1.TOKENS.SOL }, constants_1.POOLS.SOL_USDC, constants_1.DEFAULT_SLIPPAGE_TOLERANCE, wallet);
            // In a real implementation, you would submit the transaction here
            // For this example, we'll just return the quote
            console.log(`Quote estimated SOL out: ${quote.tokenEstOut}`);
            console.log(`Number of instructions: ${instructions.length}`);
            const latestBlockHash = await rpc.getLatestBlockhash().send();
            console.log("Here1");
            const transactionMessage = await (0, kit_1.pipe)((0, kit_1.createTransactionMessage)({ version: 0 }), tx => (0, kit_1.setTransactionMessageFeePayer)(wallet.address, tx), tx => (0, kit_1.setTransactionMessageLifetimeUsingBlockhash)(latestBlockHash.value, tx), tx => (0, kit_1.appendTransactionMessageInstructions)(instructions, tx));
            console.log("Here2");
            const getComputeUnitEstimateForTransactionMessage = (0, kit_1.getComputeUnitEstimateForTransactionMessageFactory)({
                rpc
            });
            console.log("Here3");
            const computeUnitEstimate = await getComputeUnitEstimateForTransactionMessage(transactionMessage) + 100_000;
            console.log("Here4");
            const medianPrioritizationFee = await rpc.getRecentPrioritizationFees()
                .send()
                .then(fees => fees
                .map(fee => Number(fee.prioritizationFee))
                .sort((a, b) => a - b)[Math.floor(fees.length / 2)]);
            console.log("Here5");
            const transactionMessageWithComputeUnitInstructions = await (0, kit_1.prependTransactionMessageInstructions)([
                (0, compute_budget_1.getSetComputeUnitLimitInstruction)({ units: computeUnitEstimate }),
                (0, compute_budget_1.getSetComputeUnitPriceInstruction)({ microLamports: medianPrioritizationFee })
            ], transactionMessage);
            console.log("Here6");
            const signedTransaction = await (0, kit_1.signTransactionMessageWithSigners)(transactionMessageWithComputeUnitInstructions);
            console.log("Here7");
            const base64EncodedWireTransaction = (0, kit_1.getBase64EncodedWireTransaction)(signedTransaction);
            console.log("Here8");
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
                    }
                    else {
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
            console.log("Here");
            return {
                success: true,
                inputAmount: Number(inputAmount),
                estimatedOutputAmount: Number(quote.tokenEstOut),
                transactionId: undefined, // In a real implementation, this would be set
                actualOutputAmount: undefined // In a real implementation, this would be set
            };
        }
        catch (error) {
            console.error('Error swapping USDC for SOL:', error);
            throw error;
        }
    }
}
exports.SwapService = SwapService;
