import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из .env (расположен в корне проекта)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Combine configuration object
export const config = {
    server: {
        // Порт, на котором будет слушать Express
        port: parseInt(process.env.PORT ?? '3000', 10),
    },
    wallet: {
        // Get private key from system environment key
        privateKey: process.env.WALLET_PRIVATE_KEY_SYSTEM ?? '',
    },
    swap: {
        // Slippage BPS (basic points). 100 bps = 1%
        defaultSlippageBps: parseInt(process.env.DEFAULT_SLIPPAGE_BPS ?? '100', 10),
    },
    logging: {
        // Logging level (info, debug, error etc.)
        level: process.env.LOG_LEVEL ?? 'info',
    },
    rpc: {
        // URL RPC node Solana
        url: process.env.SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com',
    },
    network: {
        // Network type (for example solanaMainnet, solanaDevnet etc.)
        type: process.env.NETWORK_TYPE ?? 'solanaMainnet',
    },
};
