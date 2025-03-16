import { Request, Response } from 'express';
import { SwapService } from '../services/swap-service';
import { SwapRequest, SwapResponse } from '../models/swap-dto';
import { DEFAULT_USDC_AMOUNT } from '../utils/constants';

export class SwapController {
    private swapService: SwapService;

    constructor() {
        this.swapService = new SwapService();
    }

    /**
     * Handle swap request
     */
    async swapUsdcForSol(req: Request, res: Response) {
        try {
            const swapRequest: SwapRequest = req.body;

            // Use provided amount or default to 1 USDC
            const usdcAmount = swapRequest.amount
                ? BigInt(swapRequest.amount * 1_000_000) // Convert to lamports (USDC has 6 decimals)
                : DEFAULT_USDC_AMOUNT;

            // Execute swap
            const result = await this.swapService.swapUsdcForSol(usdcAmount);



            // Format and send response
            const response: SwapResponse = {
                success: true,
                inputAmount: Number(usdcAmount) / 1_000_000, // Convert from lamports to USDC
                estimatedOutputAmount: result.estimatedOutputAmount / 1_000_000_000, // Convert from lamports to SOL
                transactionId: result.transactionId,
                actualOutputAmount: result.actualOutputAmount ? result.actualOutputAmount / 1_000_000_000 : undefined
            };

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in swap controller:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Send error response
            const response: SwapResponse = {
                success: false,
                error: errorMessage,
                inputAmount: 0,
                estimatedOutputAmount: 0
            };

            res.status(500).json(response);
        }
    }
}