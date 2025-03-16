"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOrcaSDK = initializeOrcaSDK;
const whirlpools_1 = require("@orca-so/whirlpools");
const kit_1 = require("@solana/kit");
const wallet_config_1 = require("./wallet-config");
/**
 * Initialize Orca SDK for devnet
 */
async function initializeOrcaSDK() {
    // Set up wallet
    const wallet = await (0, wallet_config_1.initializeWallet)();
    // Set up RPC client for devnet
    const rpc = (0, kit_1.createSolanaRpc)((0, kit_1.mainnet)('https://api.mainnet-beta.solana.com'));
    // Configure Orca SDK for devnet
    await (0, whirlpools_1.setWhirlpoolsConfig)('solanaMainnet');
    // Set wallet as the default funder
    (0, whirlpools_1.setDefaultFunder)(wallet);
    return { wallet, rpc: rpc };
}
