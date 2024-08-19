import { ApiAccount, ApiTransaction, createHiveChain, type IHiveChainInterface, type TTransactionRequiredAuthorities } from '@hiveio/wax';
import { EPackType, type TVerifyAuthority } from '~/types/wax';

export class WaxAccountInformation {
  private chain!: IHiveChainInterface;

  private async requireChain (): Promise<void> {
    if (typeof this.chain === 'undefined')
      this.chain = await createHiveChain();
  }

  async getPackType (transaction: ApiTransaction): Promise<EPackType> {
    await this.requireChain();

    try {
      await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
        trx: transaction,
        pack: EPackType.HF26
      });
      return EPackType.HF26;
    } catch (error) {
      console.log(error);
      return EPackType.LEGACY;
    }
  }

  public getSignatures (trx: ApiTransaction): string[] {
    return trx.signatures;
  }

  public async getSignatureKeys (trx: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    return this.chain.Transaction.fromApi(trx).signatureKeys;
  }

  public async getTransactionId (trx: ApiTransaction): Promise<string> {
    await this.requireChain();

    return this.chain.Transaction.fromApi(trx).id;
  }

  public async getSigDigest (trx: ApiTransaction): Promise<string> {
    await this.requireChain();

    return this.chain.Transaction.fromApi(trx).sigDigest;
  }

  public async getRequiredAuthorities (trx: ApiTransaction): Promise<TTransactionRequiredAuthorities> {
    await this.requireChain();

    return this.chain.Transaction.fromApi(trx).requiredAuthorities;
  }

  public async getAccounts (accounts: string[]): Promise<ApiAccount[]> {
    await this.requireChain();

    return (await this.chain.api.database_api.find_accounts({ accounts })).accounts;
  }

  public async findSigneesForKey (key: string): Promise<string[]> {
    return (await this.chain.api.account_by_key_api.get_key_references({ keys: [key] })).accounts[0];
  }

  public async changeEndpointUrl (url: string): Promise<void> {
    await this.requireChain();

    this.chain.api.account_by_key_api.endpointUrl = url;
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      wax: new WaxAccountInformation()
    }
  };
});
