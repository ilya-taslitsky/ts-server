export type SwapReqDto = Readonly<{
    token: string;
    amount: number;
    poolAddress: string;
    slippage: number;
}>;