"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.requestLogger = requestLogger;
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config");
// Создаем форматтер для логов
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
}));
// Конфигурация логгера
exports.logger = winston_1.default.createLogger({
    level: config_1.config.logging.level,
    format: customFormat,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), customFormat),
        }),
        new winston_1.default.transports.File({
            filename: 'error.log',
            level: 'error',
        }),
        new winston_1.default.transports.File({
            filename: 'combined.log',
        }),
    ],
});
// Специальный middleware для логирования API-запросов
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        exports.logger.info('API Request', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.headers['x-forwarded-for'],
        });
    });
    next();
}
