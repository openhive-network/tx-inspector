/* eslint-disable @typescript-eslint/naming-convention */
import type { NaiAsset } from '@hiveio/wax';

export interface ITransferOperation {
  from: string;
  to: string;
  amount: NaiAsset | undefined;
  memo: string;
  request_id?: number;
  remaining_executions?: number;
  consecutive_failures?: number;
  deleted?: boolean;
}

export interface IEscrowTransferOperation {
  from: string;
  to: string;
  agent: string;
  who?: string;
  escrow_id: number;
  fee?: NaiAsset;
  hive_amount?: NaiAsset;
  hbd_amount?: NaiAsset;
  ratification_deadline?: string;
  escrow_expiration?: string;
  json_meta?: string;
}

export interface ICancelTransferOperation {
  request_id: number;
  from: string;
}

export interface IRecurrentTransferOperation extends ITransferOperation {
  executions: number;
  recurrence: number;
}
