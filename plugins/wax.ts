import { ApiAccount, ApiOperation, ApiTransaction, createHiveChain, type IHiveChainInterface, type TTransactionRequiredAuthorities } from '@hiveio/wax';
import { EAuthorityLevel, EPackType, type TGetTransaction, type TVerifyAuthority } from '~/types/wax';

export class WaxAccountInformation {
  private chain!: IHiveChainInterface;

  private async requireChain (): Promise<void> {
    if (typeof this.chain === 'undefined')
      this.chain = await createHiveChain();
  }

  public async getTransactionFromId (id: string): Promise<ApiTransaction> {
    await this.requireChain();

    const trx = (await this.chain.extend<TGetTransaction>().api.account_history_api.get_transaction({ id }));

    if (typeof trx === 'undefined')
      throw new Error('Transaction not found');

    return trx;
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

  public async getAuthorityType (trx: ApiTransaction): Promise<EAuthorityLevel> {
    await this.requireChain();

    const requiredAuthorities = await this.getRequiredAuthorities(trx);

    if (requiredAuthorities.owner.size !== 0)
      return EAuthorityLevel.OWNER;

    if (requiredAuthorities.active.size !== 0)
      return EAuthorityLevel.ACTIVE;

    if (requiredAuthorities.posting.size !== 0)
      return EAuthorityLevel.POSTING;

    return EAuthorityLevel.POSTING;
  }

  public async getOperationsFromTransaction (trx: ApiTransaction): Promise<ApiOperation[]> {
    await this.requireChain();

    return trx.operations;
  }

  public async findSigneesForKeys (keys: string[]): Promise<string[][]> {
    return (await this.chain.api.account_by_key_api.get_key_references({ keys })).accounts;
  }

  public async findSigneeForKey (key: string): Promise<string[][]> {
    this.requireChain();

    return (await this.chain.api.account_by_key_api.get_key_references({ keys: [key] })).accounts;
  }

  public async checkVerifyAuthority (trx: ApiTransaction): Promise<boolean> {
    await this.requireChain();

    try {
      return (
        await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
          trx,
          pack: EPackType.HF26
        })
      ).valid;
    } catch (error) {}
    try {
      return (
        await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
          trx,
          pack: EPackType.LEGACY
        })
      ).valid;
    } catch (error) {
      return false;
    }
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
