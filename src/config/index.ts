import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из .env (расположен в корне проекта)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Собираем объект конфигурации
export const config = {
    server: {
        // Порт, на котором будет слушать Express
        port: parseInt(process.env.PORT ?? '3000', 10),
    },
    wallet: {
        // Приватный ключ кошелька (base58-строка), загружается из .env
        privateKey: process.env.WALLET_PRIVATE_KEY ?? '',
    },
    swap: {
        // Slippage BPS (basic points). 100 bps = 1%
        defaultSlippageBps: parseInt(process.env.DEFAULT_SLIPPAGE_BPS ?? '100', 10),
    },
    logging: {
        // Уровень логирования (info, debug, error и т.д.)
        level: process.env.LOG_LEVEL ?? 'info',
    },
    rpc: {
        // URL RPC узла Solana
        url: process.env.SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com',
    },
    network: {
        // Тип сети (например, solanaMainnet, solanaDevnet и т.д.)
        type: process.env.NETWORK_TYPE ?? 'solanaMainnet',
    },
};
