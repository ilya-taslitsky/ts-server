"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWallet = initializeWallet;
exports.getWallet = getWallet;
const bs58_1 = __importDefault(require("bs58"));
const logger_1 = require("../utils/logger");
const index_1 = require("./index");
const kit_1 = require("@solana/kit");
/**
 * Инициализирует кошелек из приватного ключа, указанного в .env.
 * В данном примере используется функция createKeyPairSignerFromBytes, как в документации Orca.
 */
let walletSigner = null;
async function initializeWallet() {
    logger_1.logger.info('Initialize Wallet');
    try {
        if (walletSigner) {
            return walletSigner;
        }
        if (!index_1.config.wallet.privateKey) {
            throw new Error('Wallet private key is not configured');
        }
        const privateKeyBytes = bs58_1.default.decode(index_1.config.wallet.privateKey);
        if (privateKeyBytes.length !== 64) {
            throw new Error(`Expected 64 bytes keypair, but got ${privateKeyBytes.length}`);
        }
        walletSigner = await (0, kit_1.createKeyPairSignerFromBytes)(privateKeyBytes);
        logger_1.logger.info(`Wallet initialized: ${walletSigner.address}`);
        return walletSigner;
    }
    catch (error) {
        logger_1.logger.error('Failed to initialize wallet', { error });
        throw new Error('Failed to initialize wallet');
    }
}
/**
 * Возвращает уже инициализированный кошелек.
 */
function getWallet() {
    if (!walletSigner) {
        throw new Error('Wallet not initialized');
    }
    return walletSigner;
}
