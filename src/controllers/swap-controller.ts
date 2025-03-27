import {Request, Response} from 'express';
import {SwapService} from '../services/swap-service';
import {SwapRespDto} from '../models/swap-resp-dto';
import {SwapReqDto} from "../models/swap-req-dto";

export class SwapController {
    private readonly swapService: SwapService;

    constructor() {
        this.swapService = new SwapService();
    }


    async getPrice(req: Request<{}, any, SwapReqDto>, res: Response<number>): Promise<void> {
        try {
            const swapRequest = req.body;

            // Get price
            const price = await this.swapService.getPrice(swapRequest);
            // Check if the price was successfully retrieved
            if (price === undefined) {
                // Return failure response
                res.status(400).json(undefined);
                return ;
            }

            // Send response
            res.status(200).json(price);
        } catch (error) {
            console.error('Error in getPrice controller:', error);
            res.status(500).json(undefined);
        }
    }

    /**
     * Handle swap request
     */
    async swap(req: Request<{}, any, SwapReqDto>, res: Response<SwapRespDto>): Promise<void> {
        try {
            const swapRequest = req.body;

            // Execute swap
            const result = await this.swapService.swap(swapRequest);
            // Check if the swap was successful
            if (!result.success) {
                // Return failure response with the error message
                const response: SwapRespDto = ({
                    success: false,
                    error: result.error ?? "Swap failed",
                });
                res.status(400).json(response);
                return ;
            }

            // Format and send response
            const response: SwapRespDto = {
                success: true,
                transactionId: result.transactionId,
                fee: result.fee ? result.fee / 1_000_000_000 : undefined,
                actualOutputAmount: result.actualOutputAmount ? result.actualOutputAmount : undefined
            };

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in swap controller:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Send error response
            const response: SwapRespDto = {
                success: false,
                error: errorMessage,
            };
            res.status(500).json(response);
        }
    }
}