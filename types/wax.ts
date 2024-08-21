/* eslint-disable @typescript-eslint/naming-convention */
import type { ApiTransaction, TWaxApiRequest } from '@hiveio/wax';

export enum EPackType {
  LEGACY = 'legacy',
  HF26 = 'hf26',
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
