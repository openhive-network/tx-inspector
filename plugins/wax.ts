import { type ApiTransaction, createHiveChain, type TWaxExtended } from '@hiveio/wax';
import type { IProcessedTransaction, TGetTransaction } from '~/types/wax';
import { WaxAccountInformation } from '~/utils/waxAccountInformation';

const wax = new WaxAccountInformation();

class TxInspectorEngine {
  private chain!: TWaxExtended<TGetTransaction>;
  private chainId!: string;
  private apiEndpoint!: string;
  private wax = new WaxAccountInformation();

  public constructor (chainId: string, apiEndpoint: string) {
    this.chainId = chainId;
    this.apiEndpoint = apiEndpoint;
  }

  private async requireChain (reinitialize = false): Promise<void> {
    if (typeof this.chain === 'undefined' || reinitialize) {
      const base = await createHiveChain({
        chainId: this.chainId,
        apiEndpoint: this.apiEndpoint
      });

      this.chain = base.extend<TGetTransaction>();
    }
  }

  public async changeConfig (chainId: string, apiEndpoint: string): Promise<void> {
    this.chainId = chainId;
    this.apiEndpoint = apiEndpoint;
    await this.requireChain(true);
  }

  public async processTransaction (transaction: ApiTransaction): Promise<IProcessedTransaction> {
    await this.requireChain();

    const packType = await this.wax.getPackType(transaction);
    const signatures = this.wax.getSignatures(transaction);
    const signatureKeys = await this.wax.getSignatureKeys(transaction);
    const transactionId = await this.wax.getTransactionId(transaction);
    const sigDigest = await this.wax.getSigDigest(transaction);
    const requiredAuthorities = await this.wax.getRequiredAuthorities(transaction);
    const authorityType = await this.wax.getAuthorityType(transaction);
    const operations = await this.wax.getOperationsFromTransaction(transaction);
    const signeesByKeys = await this.wax.findSigneesForKeys(signatureKeys);
    const isValid = await this.wax.checkVerifyAuthority(transaction);

    return {
      packType,
      signatures,
      signatureKeys,
      transactionId,
      sigDigest,
      requiredAuthorities,
      authorityType,
      operations,
      signeesByKeys,
      isValid
    };
  }

  public async processTransactionId (id: string): Promise<IProcessedTransaction> {
    await this.requireChain();

    const transaction = await this.chain.api.account_history_api.get_transaction({ id });

    const packType = await this.wax.getPackType(transaction, id);
    const signatures = this.wax.getSignatures(transaction);
    const signatureKeys = await this.wax.getSignatureKeys(transaction);
    const transactionId = await this.wax.getTransactionId(transaction);
    const sigDigest = await this.wax.getSigDigest(transaction);
    const requiredAuthorities = await this.wax.getRequiredAuthorities(transaction);
    const authorityType = await this.wax.getAuthorityType(transaction);
    const operations = await this.wax.getOperationsFromTransaction(transaction);
    const signeesByKeys = await this.wax.findSigneesForKeys(signatureKeys);
    const isValid = await this.wax.checkVerifyAuthority(transaction);

    return {
      packType,
      signatures,
      signatureKeys,
      transactionId,
      sigDigest,
      requiredAuthorities,
      authorityType,
      operations,
      signeesByKeys,
      isValid
    };
  }
}

const txInspector = new TxInspectorEngine('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      txInspector,
      wax,
      chain: await wax.getChain()
    }
  };
});
