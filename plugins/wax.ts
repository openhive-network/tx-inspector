import { ApiAccount, ApiOperation, ApiTransaction, authority, createHiveChain, type IHiveChainInterface, type TTransactionRequiredAuthorities } from '@hiveio/wax';
import { EAuthorityLevel, EPackType, type TGetTransaction, type TVerifyAuthority } from '~/types/wax';

export class WaxAccountInformation {
  private chain!: IHiveChainInterface;

  private async requireChain (): Promise<void> {
    if (typeof this.chain === 'undefined')
      this.chain = await createHiveChain();
  }

  public async getChain (): Promise<IHiveChainInterface> {
    await this.requireChain();

    return this.chain;
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

  public async getSignatureKeys (transaction: ApiTransaction): Promise<string[]> {
    await this.requireChain();

    const trx = this.chain.Transaction.fromApi(transaction);

    const signatureKeys = await this.getPackType(transaction) === EPackType.HF26 ? trx.signatureKeys : trx.legacy_signatureKeys;

    if (typeof signatureKeys === 'undefined')
      throw new Error('Signature keys not found');

    return signatureKeys;
  }

  public async getTransactionId (transaction: ApiTransaction): Promise<string> {
    await this.requireChain();

    const trx = this.chain.Transaction.fromApi(transaction);

    const id = await this.getPackType(transaction) === EPackType.HF26 ? trx.id : trx.legacy_id;

    if (typeof id === 'undefined')
      throw new Error('Transaction ID not found');

    return id;
  }

  public async getSigDigest (transaction: ApiTransaction): Promise<string> {
    await this.requireChain();

    const trx = this.chain.Transaction.fromApi(transaction);

    const sigDigest = await this.getPackType(transaction) === EPackType.HF26 ? trx.sigDigest : trx.legacy_sigDigest;

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

  public async getRequiredAuthoritiesForOperation (trx: ApiTransaction, operationIndex: number): Promise<TTransactionRequiredAuthorities> {
    await this.requireChain();

    const builtTx = this.chain.Transaction.fromApi(trx);

    if (trx.operations.length === 1)
      return builtTx.requiredAuthorities;

    // Ignore TaPoS as we do not check transaction validity, just extract the required authorities
    const tx = new this.chain.Transaction('', trx.expiration);

    tx.pushOperation(builtTx.transaction.operations[operationIndex]);

    return tx.requiredAuthorities;
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

  public async getAuthorityType (trx: ApiTransaction): Promise<{ level: EAuthorityLevel, accounts: Set<string> | Array<authority> }[]> {
    await this.requireChain();

    const authLevel: { level: EAuthorityLevel, accounts: Set<string> | Array<authority> }[] = [];

    const requiredAuthorities = await this.getRequiredAuthorities(trx);

    if (requiredAuthorities.owner.size !== 0)
      authLevel.push({ level: EAuthorityLevel.OWNER, accounts: requiredAuthorities.owner });

    if (requiredAuthorities.active.size !== 0)
      authLevel.push({ level: EAuthorityLevel.ACTIVE, accounts: requiredAuthorities.active });

    if (requiredAuthorities.posting.size !== 0)
      authLevel.push({ level: EAuthorityLevel.POSTING, accounts: requiredAuthorities.posting });

    return authLevel;
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

const wax = new WaxAccountInformation();

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      wax,
      chain: await wax.getChain()
    }
  };
});
