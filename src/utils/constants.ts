import { address } from '@solana/kit';

export const TOKENS = {
    // Devnet addresses
    SOL: address("So11111111111111111111111111111111111111112"),
    USDC: address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
};

export const POOLS = {
    // SOL/USDC Whirlpool on devnet
    SOL_USDC: address("Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE"),
};

// Default swap amount (1 USDC with 6 decimals)
export const DEFAULT_USDC_AMOUNT = 1_000_000n;

// Default slippage tolerance (1%)
export const DEFAULT_SLIPPAGE_TOLERANCE = 100;