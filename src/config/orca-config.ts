import { setWhirlpoolsConfig, setDefaultFunder } from '@orca-so/whirlpools';
import {createSolanaRpc, devnet, mainnet} from '@solana/kit';
import { initializeWallet } from './wallet-config';

/**
 * Initialize Orca SDK for devnet
 */
export async function initializeOrcaSDK() {
    // Set up wallet
    const wallet = await initializeWallet();

    // Set up RPC client for devnet
    const rpc = createSolanaRpc(mainnet('https://api.mainnet-beta.solana.com'));

    // Configure Orca SDK for devnet
    await setWhirlpoolsConfig('solanaMainnet');

    // Set wallet as the default funder
    setDefaultFunder(wallet);

    return { wallet, rpc: rpc};
}