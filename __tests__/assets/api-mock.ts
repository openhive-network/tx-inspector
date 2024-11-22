/* eslint-disable no-console */
import type { ApiAccount, ApiTransaction } from '@hiveio/wax';
import type { EPackType, ITransactionAnalyzerApi, IProcessedTransaction } from '../../types/wax.js';

export interface IMockData {
  validTxAuthority: boolean;
  packType: EPackType;
  keyReferences: { keys: string[], accounts: string[] }[];
  findAccounts: { paramsAccounts: string[], accounts: ApiAccount[] }[];
}

export type TMockExtendedData = IMockData & Record<string, ApiTransaction | IProcessedTransaction | ApiAccount[]>;

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
    const item = this.mockData.keyReferences.find(({ keys }) => keys.length === params.keys.length && keys.every((key, index) => key === params.keys[index]));

    return { accounts: (item ? item.accounts : null!) as unknown as string[][] };
  }

  public findAccounts (params: { accounts: string[]; }): { accounts: ApiAccount[]; } {
    const item = this.mockData.findAccounts.find(({ paramsAccounts }) => paramsAccounts.length === params.accounts.length && paramsAccounts.every((account, index) => account === params.accounts[index]));

    return { accounts: item ? item.accounts : [] };
  }

  public getPackType (): EPackType {
    return this.mockData.packType;
  }
}
