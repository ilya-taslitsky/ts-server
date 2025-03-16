"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SLIPPAGE_TOLERANCE = exports.DEFAULT_USDC_AMOUNT = exports.POOLS = exports.TOKENS = void 0;
const kit_1 = require("@solana/kit");
exports.TOKENS = {
    // Devnet addresses
    SOL: (0, kit_1.address)("So11111111111111111111111111111111111111112"),
    USDC: (0, kit_1.address)("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
};
exports.POOLS = {
    // SOL/USDC Whirlpool on devnet
    SOL_USDC: (0, kit_1.address)("Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE"),
};
// Default swap amount (1 USDC with 6 decimals)
exports.DEFAULT_USDC_AMOUNT = 1000000n;
// Default slippage tolerance (1%)
exports.DEFAULT_SLIPPAGE_TOLERANCE = 100;
