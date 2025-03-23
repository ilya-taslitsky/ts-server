export type SwapRespDto = Readonly<{
    transactionId?: string;
    inputAmount: number;
    estimatedOutputAmount: number;
    actualOutputAmount?: number;
    success: boolean;
    error?: string;
}>