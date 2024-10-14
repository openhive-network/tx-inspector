import type { ApiAccount, ApiTransaction } from '@hiveio/wax';
import type { EPackType, ITransactionAnalyzerApi } from '../../types/wax.js';

export class TransactionAnalyzerApiMock implements ITransactionAnalyzerApi {
  private readonly mockData: any; // TODO: Replace any with the actual type

  public constructor (mockData: any) {
    this.mockData = JSON.parse(mockData);
  }

  public async verifyAuthority (_params: { trx: ApiTransaction; pack: EPackType; }): Promise<{ valid: boolean; }> {
    return await this.mockData.valid;
  }

  public async getKeyReferences (_params: { keys: string[]; }): Promise<{ accounts: string[][]; }> {
    return await this.mockData.keyReferences;
  }

  public async findAccounts (_params: { accounts: string[]; }): Promise<{ accounts: ApiAccount[]; }> {
    return await this.mockData.accounts;
  }
}
