import {setWhirlpoolsConfig, setDefaultFunder} from '@orca-so/whirlpools';
import {createSolanaRpc, mainnet} from '@solana/kit';
import {initializeWallet} from './wallet-config';
import {config} from './index';

/**
 * Initialize Orca SDK for devnet
 */
export async function initializeOrcaSDK() {
    // Set up wallet
    const wallet = await initializeWallet();

    // Set up RPC client
    const rpc = createSolanaRpc(mainnet(config.rpc.url));

    // Configure Orca SDK
    await setWhirlpoolsConfig(config.network.type);

    // Set wallet as the default funder
    setDefaultFunder(wallet);

    return {wallet, rpc: rpc};
}