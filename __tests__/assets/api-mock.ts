import type { ApiAccount, ApiTransaction } from '@hiveio/wax';
import type { EPackType, ITransactionAnalyzerApi } from '../../types/wax.js';

export interface IMockData {
  validTxAuthority: boolean,
  keyReferences: string[]
};

export class TransactionAnalyzerApiMock implements ITransactionAnalyzerApi {
  private mockData!: IMockData; // TODO: Replace any with the actual type

  public constructor() {
  }

  public load(inputData: IMockData): void {
    console.log(`Loading mocked data: ${JSON.stringify(inputData)}`);
    this.mockData = inputData;
  }

  public async verifyAuthority (_params: { trx: ApiTransaction; pack: EPackType; }): Promise<{ valid: boolean; }> {
    return { valid: this.mockData.validTxAuthority };
  }

  public async getKeyReferences (_params: { keys: string[]; }): Promise<{ accounts: string[][]; }> {
    return { accounts: Array<string[]>(this.mockData.keyReferences) }; ///TODO
  }

  public async findAccounts (_params: { accounts: string[]; }): Promise<{ accounts: ApiAccount[]; }> {
    return { accounts: [] }; /// TODO
  }
}
