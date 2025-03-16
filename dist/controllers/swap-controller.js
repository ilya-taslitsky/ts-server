"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapController = void 0;
const swap_service_1 = require("../services/swap-service");
const constants_1 = require("../utils/constants");
class SwapController {
    swapService;
    constructor() {
        this.swapService = new swap_service_1.SwapService();
    }
    /**
     * Handle swap request
     */
    async swapUsdcForSol(req, res) {
        try {
            const swapRequest = req.body;
            // Use provided amount or default to 1 USDC
            const usdcAmount = swapRequest.amount
                ? BigInt(swapRequest.amount * 1_000_000) // Convert to lamports (USDC has 6 decimals)
                : constants_1.DEFAULT_USDC_AMOUNT;
            // Execute swap
            const result = await this.swapService.swapUsdcForSol(usdcAmount);
            // Format and send response
            const response = {
                success: true,
                inputAmount: Number(usdcAmount) / 1_000_000, // Convert from lamports to USDC
                estimatedOutputAmount: result.estimatedOutputAmount / 1_000_000_000, // Convert from lamports to SOL
                transactionId: result.transactionId,
                actualOutputAmount: result.actualOutputAmount ? result.actualOutputAmount / 1_000_000_000 : undefined
            };
            res.status(200).json(response);
        }
        catch (error) {
            console.error('Error in swap controller:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // Send error response
            const response = {
                success: false,
                error: errorMessage,
                inputAmount: 0,
                estimatedOutputAmount: 0
            };
            res.status(500).json(response);
        }
    }
}
exports.SwapController = SwapController;
