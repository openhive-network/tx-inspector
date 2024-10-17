/* eslint-disable no-console */
import type { ApiAccount, ApiTransaction } from '@hiveio/wax';
import type { EPackType, ITransactionAnalyzerApi } from '../../types/wax.js';

export interface IMockData {
  validTxAuthority: boolean,
  keyReferences: string[],
  accounts: ApiAccount[]
}

export class TransactionAnalyzerApiMock implements ITransactionAnalyzerApi {
  private mockData!: IMockData; // TODO: Replace any with the actual type

  public load (inputData: IMockData): void {
    console.log(`Loading mocked data: ${JSON.stringify(inputData)}`);
    this.mockData = inputData;
  }

  public verifyAuthority (_params: { trx: ApiTransaction; pack: EPackType; }): { valid: boolean; } {
    return { valid: this.mockData.validTxAuthority };
  }

  public getKeyReferences (_params: { keys: string[]; }): { accounts: string[][]; } {
    return { accounts: [this.mockData.keyReferences] }; /// TODO
  }

  public findAccounts (_params: { accounts: string[]; }): { accounts: ApiAccount[]; } {
    return { accounts: this.mockData.accounts }; /// TODO
  }
}
