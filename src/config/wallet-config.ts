import bs58 from 'bs58';
import {logger} from '../utils/logger';
import {config} from './index';
import {createKeyPairSignerFromBytes} from '@solana/kit';

/**
 * Инициализирует кошелек из приватного ключа, указанного в system environment key
 */

let walletSigner: any = null;

export async function initializeWallet(): Promise<any> {
    logger.info('Initialize Wallet');

    if (!config.wallet.privateKey) {
        throw new Error('Wallet private key is not configured. \n' +
            ' Check system environment key: WALLET_PRIVATE_KEY_SYSTEM ');
    }
    const privateKeyBytes = bs58.decode(config.wallet.privateKey);

    if (privateKeyBytes.length !== 64) {
        throw new Error(`Expected 64 bytes keypair, but got ${privateKeyBytes.length}`);
    }

    try {
        if (walletSigner) {
            return walletSigner;
        }

        walletSigner = await createKeyPairSignerFromBytes(privateKeyBytes);
        logger.info(`Wallet initialized: ${walletSigner.address}`);
        return walletSigner;
    } catch (error) {
        logger.error('Failed to initialize wallet', { error });
        throw error;
    }
}
