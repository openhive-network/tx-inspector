/* eslint-disable no-console */
import type { ApiAccount, ApiTransaction } from '@hiveio/wax';
import type { EPackType, ITransactionAnalyzerApi } from '../../types/wax.js';

export interface IMockData {
  validTxAuthority: boolean;
  keyReferences: string[];
  accounts: ApiAccount[];
  packType: EPackType;
}

export class TransactionAnalyzerApiMock implements ITransactionAnalyzerApi {
  private mockData!: IMockData;

  public load (inputData: IMockData): void {
    console.log(`Loading mocked data: ${JSON.stringify(inputData)}`);
    this.mockData = inputData;
  }

  public verifyAuthority (_params: { trx: ApiTransaction; pack: EPackType; }): { valid: boolean; } {
    return { valid: this.mockData.validTxAuthority };
  }

  public getKeyReferences (_params: { keys: string[]; }): { accounts: string[][]; } {
    return { accounts: [this.mockData.keyReferences] };
  }

  public findAccounts (_params: { accounts: string[]; }): { accounts: ApiAccount[]; } {
    return { accounts: this.mockData.accounts };
  }

  public getPackType (): EPackType {
    return this.mockData.packType;
  }
}
