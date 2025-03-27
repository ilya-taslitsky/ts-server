export type SwapReqDto = Readonly<{
    token: string;
    amount: number;
    slippage: number;
    isBuy: boolean;
}>;