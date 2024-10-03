/* eslint-disable @typescript-eslint/naming-convention */
import type { ApiOperation, ApiTransaction, authority, TTransactionRequiredAuthorities, TWaxApiRequest } from '@hiveio/wax';

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

export interface IProcessedTransaction {
  packType: EPackType;
  signatures: string[];
  signatureKeys: string[];
  transactionId: string | [string, string];
  sigDigest: string | [string, string];
  requiredAuthorities: TTransactionRequiredAuthorities;
  authorityType: { level: EAuthorityLevel, accounts: Set<string> | Array<authority> }[];
  operations: ApiOperation[];
  signeesByKeys: string[][];
  isValid: boolean;
}
