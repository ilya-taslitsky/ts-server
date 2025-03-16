"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Загружаем переменные окружения из .env (расположен в корне проекта)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Собираем объект конфигурации
exports.config = {
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
