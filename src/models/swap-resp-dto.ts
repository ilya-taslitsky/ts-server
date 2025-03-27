export type SwapRespDto = Readonly<{
    transactionId?: string;
    actualOutputAmount?: number;
    fee?: number;
    success: boolean;
    error?: string;
}>