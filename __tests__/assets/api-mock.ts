/* eslint-disable no-console */
import type { ApiAccount, ApiTransaction } from '@hiveio/wax';
import type { EPackType, ITransactionAnalyzerApi } from '../../types/wax.js';
import type { IExpectedResult } from './jest-helper.js';

export interface IMockData {
  validTxAuthority: boolean;
  packType: EPackType;
}

export type TMockExtendedData = IMockData & Record<string, ApiTransaction | IExpectedResult | ApiAccount[] | string[]>;

export class TransactionAnalyzerApiMock implements ITransactionAnalyzerApi {
  private mockData!: IMockData;

  public load (inputData: IMockData): void {
    console.log(`Loading mocked data: ${JSON.stringify(inputData)}`);
    this.mockData = inputData;
  }

  public verifyAuthority (_params: { trx: ApiTransaction; pack: EPackType; }): { valid: boolean; } {
    return { valid: this.mockData.validTxAuthority };
  }

  public getKeyReferences (params: { keys: string[]; }): { accounts: string[][]; } {
    const keysArrToString = params.keys.join('-');

    return { accounts: [this.mockData[`keyReferences-${keysArrToString}`]] };
  }

  public findAccounts (params: { accounts: string[]; }): { accounts: ApiAccount[]; } {
    const accountsArrToString = params.accounts.join('-');

    return { accounts: this.mockData[`findAccounts-${accountsArrToString}`] };
  }

  public getPackType (): EPackType {
    return this.mockData.packType;
  }
}
