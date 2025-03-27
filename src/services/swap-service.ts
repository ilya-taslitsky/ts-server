import {ExactInParams, ExactOutParams, SwapInstructions, swapInstructions} from '@orca-so/whirlpools';
import {initializeOrcaSDK} from '../config/orca-config';
import {config} from '../config';
import { TokenMints } from '../utils/TokenMints';

import {getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction} from '@solana-program/compute-budget';
import {
    address,
    Address,
    appendTransactionMessageInstructions,
    createTransactionMessage,
    GetAccountInfoApi,
    getBase64EncodedWireTransaction,
    getComputeUnitEstimateForTransactionMessageFactory,
    GetEpochInfoApi,
    GetMinimumBalanceForRentExemptionApi,
    GetMultipleAccountsApi, IInstruction,
    pipe,
    prependTransactionMessageInstructions,
    RpcMainnet,
    setTransactionMessageFeePayer,
    setTransactionMessageLifetimeUsingBlockhash,
    Signature,
    signTransactionMessageWithSigners,
    SolanaRpcApiMainnet
} from '@solana/kit';
import {SwapReqDto} from "../models/swap-req-dto";

import {SwapRespDto} from "../models/swap-resp-dto";
import {GetBalanceApi} from "@solana/rpc-api/dist/types/getBalance";
import {GetBlockApi} from "@solana/rpc-api/dist/types/getBlock";
import {GetBlockCommitmentApi} from "@solana/rpc-api/dist/types/getBlockCommitment";
import {GetBlockHeightApi} from "@solana/rpc-api/dist/types/getBlockHeight";
import {GetBlockProductionApi} from "@solana/rpc-api/dist/types/getBlockProduction";
import {GetBlocksApi} from "@solana/rpc-api/dist/types/getBlocks";
import {GetBlocksWithLimitApi} from "@solana/rpc-api/dist/types/getBlocksWithLimit";
import {GetBlockTimeApi} from "@solana/rpc-api/dist/types/getBlockTime";
import {GetClusterNodesApi} from "@solana/rpc-api/dist/types/getClusterNodes";
import {GetEpochScheduleApi} from "@solana/rpc-api/dist/types/getEpochSchedule";
import {GetFeeForMessageApi} from "@solana/rpc-api/dist/types/getFeeForMessage";
import {GetFirstAvailableBlockApi} from "@solana/rpc-api/dist/types/getFirstAvailableBlock";
import {GetGenesisHashApi} from "@solana/rpc-api/dist/types/getGenesisHash";
import {GetHealthApi} from "@solana/rpc-api/dist/types/getHealth";
import {GetHighestSnapshotSlotApi} from "@solana/rpc-api/dist/types/getHighestSnapshotSlot";
import {GetIdentityApi} from "@solana/rpc-api/dist/types/getIdentity";
import {GetInflationGovernorApi} from "@solana/rpc-api/dist/types/getInflationGovernor";
import {GetInflationRateApi} from "@solana/rpc-api/dist/types/getInflationRate";
import {GetInflationRewardApi} from "@solana/rpc-api/dist/types/getInflationReward";
import {GetLargestAccountsApi} from "@solana/rpc-api/dist/types/getLargestAccounts";
import {GetLatestBlockhashApi} from "@solana/rpc-api/dist/types/getLatestBlockhash";
import {GetLeaderScheduleApi} from "@solana/rpc-api/dist/types/getLeaderSchedule";
import {GetMaxRetransmitSlotApi} from "@solana/rpc-api/dist/types/getMaxRetransmitSlot";
import {GetMaxShredInsertSlotApi} from "@solana/rpc-api/dist/types/getMaxShredInsertSlot";
import {GetProgramAccountsApi} from "@solana/rpc-api/dist/types/getProgramAccounts";
import {GetRecentPerformanceSamplesApi} from "@solana/rpc-api/dist/types/getRecentPerformanceSamples";
import {GetRecentPrioritizationFeesApi} from "@solana/rpc-api/dist/types/getRecentPrioritizationFees";
import {GetSignaturesForAddressApi} from "@solana/rpc-api/dist/types/getSignaturesForAddress";
import {GetSignatureStatusesApi} from "@solana/rpc-api/dist/types/getSignatureStatuses";
import {GetSlotApi} from "@solana/rpc-api/dist/types/getSlot";
import {GetSlotLeaderApi} from "@solana/rpc-api/dist/types/getSlotLeader";
import {GetSlotLeadersApi} from "@solana/rpc-api/dist/types/getSlotLeaders";
import {GetStakeMinimumDelegationApi} from "@solana/rpc-api/dist/types/getStakeMinimumDelegation";
import {GetSupplyApi} from "@solana/rpc-api/dist/types/getSupply";
import {GetTokenAccountBalanceApi} from "@solana/rpc-api/dist/types/getTokenAccountBalance";
import {GetTokenAccountsByDelegateApi} from "@solana/rpc-api/dist/types/getTokenAccountsByDelegate";
import {GetTokenAccountsByOwnerApi} from "@solana/rpc-api/dist/types/getTokenAccountsByOwner";
import {GetTokenLargestAccountsApi} from "@solana/rpc-api/dist/types/getTokenLargestAccounts";
import {GetTokenSupplyApi} from "@solana/rpc-api/dist/types/getTokenSupply";
import {GetTransactionApi} from "@solana/rpc-api/dist/types/getTransaction";
import {GetTransactionCountApi} from "@solana/rpc-api/dist/types/getTransactionCount";
import {GetVersionApi} from "@solana/rpc-api/dist/types/getVersion";
import {GetVoteAccountsApi} from "@solana/rpc-api/dist/types/getVoteAccounts";
import {IsBlockhashValidApi} from "@solana/rpc-api/dist/types/isBlockhashValid";
import {MinimumLedgerSlotApi} from "@solana/rpc-api/dist/types/minimumLedgerSlot";
import {SendTransactionApi} from "@solana/rpc-api/dist/types/sendTransaction";
import {SimulateTransactionApi} from "@solana/rpc-api/dist/types/simulateTransaction";
type SolanaRpcApiForAllClusters = GetAccountInfoApi & GetBalanceApi & GetBlockApi & GetBlockCommitmentApi & GetBlockHeightApi & GetBlockProductionApi & GetBlocksApi & GetBlocksWithLimitApi & GetBlockTimeApi & GetClusterNodesApi & GetEpochInfoApi & GetEpochScheduleApi & GetFeeForMessageApi & GetFirstAvailableBlockApi & GetGenesisHashApi & GetHealthApi & GetHighestSnapshotSlotApi & GetIdentityApi & GetInflationGovernorApi & GetInflationRateApi & GetInflationRewardApi & GetLargestAccountsApi & GetLatestBlockhashApi & GetLeaderScheduleApi & GetMaxRetransmitSlotApi & GetMaxShredInsertSlotApi & GetMinimumBalanceForRentExemptionApi & GetMultipleAccountsApi & GetProgramAccountsApi & GetRecentPerformanceSamplesApi & GetRecentPrioritizationFeesApi & GetSignaturesForAddressApi & GetSignatureStatusesApi & GetSlotApi & GetSlotLeaderApi & GetSlotLeadersApi & GetStakeMinimumDelegationApi & GetSupplyApi & GetTokenAccountBalanceApi & GetTokenAccountsByDelegateApi & GetTokenAccountsByOwnerApi & GetTokenLargestAccountsApi & GetTokenSupplyApi & GetTransactionApi & GetTransactionCountApi & GetVersionApi & GetVoteAccountsApi & IsBlockhashValidApi & MinimumLedgerSlotApi & SendTransactionApi & SimulateTransactionApi;


export class SwapService {
    private wallet: any;
    private usdcMutiplier = 1_000_000;
    private solMultiplier = 1_000_000_000;
    private usdcMint:string = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

    private rpc!: RpcMainnet<SolanaRpcApiForAllClusters>;
    constructor() {
        this.initialize();
    }

    private async initialize() {
        const { wallet, rpc } = await initializeOrcaSDK();
        this.wallet = wallet;
        this.rpc = rpc;
    }

    private getSwapParams(req: SwapReqDto) {
        const amount = BigInt(req.amount * this.solMultiplier);
        const tokenAMint =  TokenMints.getMint(req.token);
        const tokenBMint = req.isBuy ? TokenMints.getMint(req.token) : this.usdcMint;
        const mint = address(tokenAMint);
        const poolAddress = address(TokenMints.getPool(req.token));
        const slippage = req.slippage ?? config.swap.defaultSlippageBps;

        return { amount, mint, tokenBMint, poolAddress, slippage };
    }


    async getPrice(req: SwapReqDto): Promise<number> {
        const { amount, mint, poolAddress, slippage } = this.getSwapParams(req);

        try {
            if (req.isBuy) {
                const outputAmount = amount;
                const {quote} = await swapInstructions<ExactOutParams & { mint: Address }>(
                    this.rpc,
                    { outputAmount, mint },
                    poolAddress,
                    slippage,
                    this.wallet
                );
                console.log(quote)
                return Number(quote.tokenEstIn) / this.usdcMutiplier;
            } else {
                const inputAmount = amount;
                const { quote } = await swapInstructions(this.rpc, { inputAmount, mint }, poolAddress, slippage, this.wallet);
                console.log(quote)
                return Number(quote.tokenEstOut) / this.usdcMutiplier;
            }

        } catch (error) {
            console.error('Error getting price:', error);
            return 0;
        }
    }



    async swap(req: SwapReqDto): Promise<SwapRespDto> {
        const { amount, mint, tokenBMint, poolAddress, slippage } = this.getSwapParams(req);

        try {
            let instructions

            if (req.isBuy) {
                const outputAmount = amount;
                instructions = await swapInstructions<ExactOutParams & { mint: Address }>(
                    this.rpc,
                    { outputAmount, mint },
                    poolAddress,
                    slippage,
                    this.wallet
                );
            } else {
                const inputAmount = amount;
                instructions = await swapInstructions(this.rpc, { inputAmount, mint }, poolAddress, slippage, this.wallet);
            }


            const latestBlockHash = await this.rpc.getLatestBlockhash().send();

            const transactionMessage = pipe(
                createTransactionMessage({ version: 0 }),
                tx => setTransactionMessageFeePayer(this.wallet.address, tx),
                tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockHash.value, tx),
                tx => appendTransactionMessageInstructions(instructions.instructions, tx)
            );

            const computeUnitEstimate = await getComputeUnitEstimateForTransactionMessageFactory({ rpc: this.rpc })(transactionMessage) + 100_000;
            const medianPrioritizationFee = await this.rpc.getRecentPrioritizationFees().send()
                .then(fees => fees.map(fee => Number(fee.prioritizationFee)).sort((a, b) => a - b)[Math.floor(fees.length / 2)]);

            const transactionMessageWithComputeUnitInstructions = prependTransactionMessageInstructions([
                getSetComputeUnitLimitInstruction({ units: computeUnitEstimate }),
                getSetComputeUnitPriceInstruction({ microLamports: medianPrioritizationFee })
            ], transactionMessage);

            const signedTransaction = await signTransactionMessageWithSigners(transactionMessageWithComputeUnitInstructions);
            const base64EncodedWireTransaction = getBase64EncodedWireTransaction(signedTransaction);

            const timeoutMs = 90000;
            const startTime = Date.now();
            let signature: Signature | undefined;
            let receivedTokenB;
            let fee;

            while (Date.now() - startTime < timeoutMs) {
                const transactionStartTime = Date.now();
                signature = await this.rpc.sendTransaction(base64EncodedWireTransaction, { maxRetries: 0n, skipPreflight: true, encoding: 'base64' }).send();
                const statuses = await this.rpc.getSignatureStatuses([signature]).send();

                if (statuses.value[0]) {
                    if (!statuses.value[0].err) {
                        const transactionDetails = await this.rpc.getTransaction(signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }).send();
                        if (transactionDetails) {
                            fee = Number(transactionDetails.meta?.fee) || 0;
                            const postBalances = transactionDetails.meta?.postTokenBalances;
                            const preBalances = transactionDetails.meta?.preTokenBalances;
                            if (postBalances && preBalances) {
                                const tokenBAccount = postBalances.find(balance => balance.mint === tokenBMint);
                                const tokenBPreBalance = preBalances.find(balance => balance.accountIndex === tokenBAccount?.accountIndex)?.uiTokenAmount.uiAmount || 0;
                                const tokenBPostBalance = tokenBAccount?.uiTokenAmount.uiAmount || 0;
                                receivedTokenB = Math.abs(tokenBPostBalance - tokenBPreBalance);
                            }
                        }
                        break;
                    } else {
                        console.error(`Transaction failed: ${statuses.value[0].err.toString()}`);
                        break;
                    }
                }

                const elapsedTime = Date.now() - transactionStartTime;
                const remainingTime = Math.max(0, 1000 - elapsedTime);
                if (remainingTime > 0) await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            if (!signature) {
                return { success: false, error: "Transaction timed out without receiving signature" };
            }

            console.log(receivedTokenB)
            return { success: true, transactionId: signature, fee, actualOutputAmount: receivedTokenB };
        } catch (error) {
            console.error('Error swapping USDC for SOL:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

}