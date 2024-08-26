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
      return EPackType.LEGACY;
    }
  }

  public getSignatures (trx: ApiTransaction): string[] {
    return trx.signatures;
  }

  public async getSignatureKeys (trx: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    const signatureKeys = this.chain.Transaction.fromApi(trx).signatureKeys;

    if (typeof signatureKeys === 'undefined')
      throw new Error('Signature keys not found');

    return signatureKeys;
  }

  public async getTransactionId (trx: ApiTransaction): Promise<string> {
    await this.requireChain();

    const id = this.chain.Transaction.fromApi(trx).id;

    if (typeof id === 'undefined')
      throw new Error('Transaction ID not found');

    return id;
  }

  public async getSigDigest (trx: ApiTransaction): Promise<string> {
    await this.requireChain();

    const sigDigest = this.chain.Transaction.fromApi(trx).sigDigest;

    if (typeof sigDigest === 'undefined')
      throw new Error('Signature digest not found');

    return sigDigest;
  }

  public async getRequiredAuthorities (trx: ApiTransaction): Promise<TTransactionRequiredAuthorities> {
    await this.requireChain();

    const requiredAuthorities = this.chain.Transaction.fromApi(trx).requiredAuthorities;

    if (typeof requiredAuthorities === 'undefined')
      throw new Error('Required authorities not found');

    return requiredAuthorities;
  }

  public async getAccounts (accountsArr: string[]): Promise<ApiAccount[]> {
    await this.requireChain();

    const { accounts } = await this.chain.api.database_api.find_accounts({ accounts: accountsArr });

    if (typeof accounts === 'undefined')
      throw new Error('Accounts not found');

    return accounts;
  }

  public async getAccountsFromId (id: string): Promise<{ accounts: ApiAccount[] }> {
    await this.requireChain();

    return (await this.chain.api.database_api.find_accounts({ accounts: [id] }));
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

    const operations = trx.operations;

    if (typeof operations === 'undefined')
      throw new Error('Operations not found');

    return operations;
  }

  public async findSigneesForKeys (keys: string[]): Promise<string[][]> {
    await this.requireChain();

    const { accounts } = await this.chain.api.account_by_key_api.get_key_references({ keys });

    if (typeof accounts === 'undefined')
      throw new Error('Signees not found');

    return accounts;
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

    try {
      this.chain.api.account_by_key_api.endpointUrl = url;
    } catch (error) {
      throw new Error('Failed to change endpoint URL');
    }
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      wax: new WaxAccountInformation()
    }
  };
});
