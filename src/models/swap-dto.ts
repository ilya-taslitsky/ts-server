// Request format for swap
export interface SwapRequest {
    amount?: number;  // Amount of USDC to swap (defaults to 1 if not provided)
}

// Response format after a swap
export interface SwapResponse {
    transactionId?: string;
    inputAmount: number;
    estimatedOutputAmount: number;
    actualOutputAmount?: number;
    success: boolean;
    error?: string;
}