import winston from 'winston';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';

// Создаем форматтер для логов
const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}]: ${message} ${metaString}`;
    })
);

// Конфигурация логгера
export const logger = winston.createLogger({
    level: config.logging.level,
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            ),
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'combined.log',
        }),
    ],
});

// Специальный middleware для логирования API-запросов
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('API Request', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.headers['x-forwarded-for'],
        });
    });

    next();
}
