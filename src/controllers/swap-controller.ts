import {Request, Response} from 'express';
import {SwapService} from '../services/swap-service';
import {SwapRespDto} from '../models/swap-resp-dto';
import {SwapReqDto} from "../models/swap-req-dto";

export class SwapController {
    private readonly swapService: SwapService;

    constructor() {
        this.swapService = new SwapService();
    }

    /**
     * Handle swap request
     */
    async swap(req: Request<{}, any, SwapReqDto>, res: Response<SwapRespDto>): Promise<void> {
        try {
            const swapRequest = req.body;
            const amount = swapRequest.amount;

            // Execute swap
            const result = await this.swapService.swap(swapRequest);
            // Check if the swap was successful
            if (!result.success) {
                // Return failure response with the error message
                const response: SwapRespDto = ({
                    success: false,
                    error: result.error ?? "Swap failed",
                    inputAmount: Number(amount) / 1_000_000,
                    estimatedOutputAmount: 0
                });
                res.status(400).json(response);
                return ;
            }

            // Format and send response
            const response: SwapRespDto = {
                success: true,
                inputAmount: Number(amount) / 1_000_000, // Convert from lamports to USDC
                estimatedOutputAmount: result.estimatedOutputAmount / 1_000_000_000, // Convert from lamports to SOL
                transactionId: result.transactionId,
                actualOutputAmount: result.actualOutputAmount ? result.actualOutputAmount / 1_000_000_000 : undefined
            };

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in swap controller:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Send error response
            const response: SwapRespDto = {
                success: false,
                error: errorMessage,
                inputAmount: 0,
                estimatedOutputAmount: 0
            };
            res.status(500).json(response);
        }
    }
}