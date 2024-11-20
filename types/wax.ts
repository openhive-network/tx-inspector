/* eslint-disable @typescript-eslint/naming-convention */
import type { ApiAccount, ApiTransaction, authority, ITransaction, TWaxApiRequest } from '@hiveio/wax';
import type { IAuthorityPaths } from '../utils/getAuthorityPath';

export enum EPackType {
  LEGACY = 'legacy',
  HF26 = 'hf26',
  UNKNOWN = 'unknown',
}

export enum EAuthorityLevel {
  POSTING = 'Posting',
  ACTIVE = 'Active',
  OWNER = 'Owner',
  OTHER = 'Other'
}

export interface IGetTransactionRequest {
  id: string;
}

export interface IGetTransactionResponse {
  trx: ApiTransaction;
}

interface IVerifyAuthorityRequest {
  trx: ApiTransaction;
  pack: EPackType;
}

export interface IVerifyAuthorityResponse {
  valid: boolean;
}

export type TGetTransaction = {
  account_history_api: {
    get_transaction: TWaxApiRequest<IGetTransactionRequest, ApiTransaction>;
  }
}

export type TVerifyAuthority = {
  database_api: {
    verify_authority: TWaxApiRequest<IVerifyAuthorityRequest, IVerifyAuthorityResponse>;
  };
};

export type TChainExtendedApiData = {
  account_history_api: {
    get_transaction: TWaxApiRequest<IGetTransactionRequest, ApiTransaction>;
  },
  database_api: {
    verify_authority: TWaxApiRequest<IVerifyAuthorityRequest, IVerifyAuthorityResponse>;
  };
};

export enum ESatisfiedState {
  TRUE = 'true',
  FALSE = 'false',
  BLOCKCHAIN_FORCED_TRUE = 'blockchain_forced_true'
}

export interface ITransactionRequiredAuthorities {
  posting: Set<string>;
  active: Set<string>;
  owner: Set<string>;
  other: Set<string>;
}

export interface ISignatureData {
  signature: string;
  packType: EPackType;
  publicKey: string;
  authorityPath: IAuthorityPaths[] | undefined;
}

export interface ITransactionData {
  id: string | { hf26: string, legacy: string };
  sigDigest: string | { hf26: string, legacy: string };
  tapos: { refBlockNum: number, refBlockPrefix: number };
  expirationTime: string;
}

export interface IRequiredAuthoritiesData {
  matchingSignature: string;
  authorityAccount: string | authority;
  authorityType: EAuthorityLevel;
  isSatisfied: ESatisfiedState;
}

export interface ITransactionBodyData {
  authorityAccount: string | authority;
  authorityType: EAuthorityLevel;
  isSatisfied: ESatisfiedState;
  operationType: string;
  operationContent: object;
}

export interface ITransactionOtherData {
  isValid: boolean;
  transaction: ITransaction;
  signeesByKeys: string[][];
}

export interface IProcessedTransaction {
  signatureData: ISignatureData[];
  transactionData: ITransactionData;
  requiredAuthoritiesData: IRequiredAuthoritiesData[];
  transactionBodyData: ITransactionBodyData[];
  transactionOtherData: ITransactionOtherData;
}

export interface ITransactionAnalyzerApi {
  verifyAuthority (params: { trx: ApiTransaction, pack: EPackType }): Promise<{ valid: boolean }> | { valid: boolean };

  getKeyReferences (params: { keys: string[] }): Promise<{ accounts: string[][] }> | { accounts: string[][] };

  findAccounts (params: { accounts: string[] }): Promise<{ accounts: ApiAccount[] }> | { accounts: ApiAccount[] };

  getPackType? (): EPackType;
}
