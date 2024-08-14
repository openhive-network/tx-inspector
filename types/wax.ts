/* eslint-disable @typescript-eslint/naming-convention */
import type { ApiTransaction, TWaxApiRequest } from '@hiveio/wax';

export interface IGetTransactionRequest {
  id: string;
}

export interface IGetTransactionResponse {
  trx: ApiTransaction;
}

export type TGetTransaction = {
  account_history_api: {
    get_transaction: TWaxApiRequest<IGetTransactionRequest, ApiTransaction>;
  }
}
