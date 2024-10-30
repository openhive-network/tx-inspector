/* eslint-disable @typescript-eslint/naming-convention */
import type { ApiAccount, ApiOperation, ApiTransaction, authority, ITransaction, TTransactionRequiredAuthorities, TWaxApiRequest } from '@hiveio/wax';

export enum EPackType {
  LEGACY = 'legacy',
  HF26 = 'hf26',
  UNKNOWN = 'unknown',
}

export enum EAuthorityLevel {
  POSTING = 'Posting',
  ACTIVE = 'Active',
  OWNER = 'Owner',
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

type TProcessedTransactionBase = {
  signatures: string[];
  signatureKeys: string[];
  requiredAuthorities: TTransactionRequiredAuthorities;
  requiredAuthoritiesForOperations: TTransactionRequiredAuthorities | TTransactionRequiredAuthorities[];
  authorityType: { level: EAuthorityLevel, accounts: Set<string> | Array<authority> }[];
  operations: ApiOperation[];
  signeesByKeys: string[][];
  isValid: boolean;
  tapos: { refBlockNum: number, refBlockPrefix: number };
  expiration: string;
  transaction: ITransaction;
}

type TProcessedTransactionPackTypeKnown = TProcessedTransactionBase & {
  packType: EPackType.HF26 | EPackType.LEGACY;
  transactionId: string;
  sigDigest: string;
}

type TProcessedTransactionPackTypeUnknown = TProcessedTransactionBase & {
  packType: EPackType.UNKNOWN;
  transactionId: { hf26: string, legacy: string };
  sigDigest: { hf26: string, legacy: string };
}

export type TProcessedTransaction = TProcessedTransactionPackTypeKnown | TProcessedTransactionPackTypeUnknown;

export interface ITransactionAnalyzerApi {
  verifyAuthority (params: { trx: ApiTransaction, pack: EPackType }): Promise<{ valid: boolean }> | { valid: boolean };

  getKeyReferences (params: { keys: string[] }): Promise<{ accounts: string[][] }> | { accounts: string[][] };

  findAccounts (params: { accounts: string[] }): Promise<{ accounts: ApiAccount[] }> | { accounts: ApiAccount[] };
}
