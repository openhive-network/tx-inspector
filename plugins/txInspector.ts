import { ApiAccount, ApiOperation, type ApiTransaction, authority, createHiveChain, type ITransaction, type TTransactionRequiredAuthorities, type TWaxExtended } from '@hiveio/wax';
import { EAuthorityLevel, EPackType, type TProcessedTransaction, type TChainExtendedApiData, type TVerifyAuthority } from '~/types/wax';

/**
 * The `TransactionAnalyzer` class is responsible for analyzing a transaction and extracting all the necessary information from it.
 *
 * It takes the hive chain object in the constructor which is responsible for communication with the blockchain api.
 *
 * It provides a method {@link analyzeTransaction} which is responsible for returning all the information about the transaction.
 */
export class TransactionAnalyzer {
  private readonly chain: TWaxExtended<TChainExtendedApiData>;
  private transaction!: ITransaction;

  public constructor (chain: TWaxExtended<TChainExtendedApiData>) {
    this.chain = chain;
  }

  /**
   * Takes the transaction and analyzes it to get all the necessary information
   * @see {@link TProcessedTransaction} for the return type
   *
   * @param {ApiTransaction} transaction Transaction in api JSON format
   * @param {?string} id id of the transaction. It ensures the pack type by comparing the provided id with the calculated transaction id.
   *
   * @returns {TProcessedTransaction} object with all information about the transaction.
   */
  public async analyzeTransaction (transaction: ApiTransaction, id?: string): Promise<TProcessedTransaction> {
    const tx = this.chain.createTransactionFromJson(transaction);

    this.transaction = tx;

    const packType = await this.getPackType(transaction, id);
    const signatures = transaction.signatures;
    const signatureKeys = this.getSignatureKeys(packType);
    const transactionId = this.getTransactionId(packType);
    const sigDigest = this.getSigDigest(packType);
    const requiredAuthorities = this.getRequiredAuthorities();
    const authorityType = this.getAuthorityType(requiredAuthorities);
    const operations = this.getOperationsFromTransaction(transaction);
    const signeesByKeys = await this.findSigneesForKeys(signatureKeys);
    const isValid = await this.checkVerifyAuthority(transaction, packType);

    return {
      packType,
      signatures,
      signatureKeys,
      transactionId,
      sigDigest,
      requiredAuthorities,
      requiredAuthoritiesForOperations: (index: number) => {
        return this.getRequiredAuthoritiesForOperation(transaction, index);
      },
      authorityType,
      operations,
      signeesByKeys,
      isValid,
      transaction: this.transaction,
      protoTransaction: tx.transaction
    } as TProcessedTransaction;
  }

  private async getPackType (trx: ApiTransaction, id?: string): Promise<EPackType> {
    if (id) {
      if (id === this.transaction.id)
        return EPackType.HF26;

      if (id === this.transaction.legacy_id)
        return EPackType.LEGACY;

      return EPackType.UNKNOWN;
    }

    try {
      await this.chain.api.database_api.verify_authority({
        trx,
        pack: EPackType.HF26
      });
      return EPackType.HF26;
    } catch {
      try {
        await this.chain.api.database_api.verify_authority({
          trx,
          pack: EPackType.LEGACY
        });
        return EPackType.LEGACY;
      } catch {
        return EPackType.UNKNOWN;
      }
    }
  }

  private getSignatureKeys (packType: EPackType): string[] {
    const signatureKeys =
      packType === EPackType.HF26 ? this.transaction.signatureKeys : this.transaction.legacy_signatureKeys;

    if (typeof signatureKeys === 'undefined')
      throw new Error('Signature keys not found');

    return signatureKeys;
  }

  private getTransactionId (packType: EPackType): string | { hf26: string, legacy: string } {
    if (packType === EPackType.UNKNOWN)
      return { hf26: this.transaction.id, legacy: this.transaction.legacy_id };

    const id = packType === EPackType.HF26 ? this.transaction.id : this.transaction.legacy_id;

    if (typeof id === 'undefined')
      throw new Error('Transaction ID not found');

    return id;
  }

  private getSigDigest (packType: EPackType): string | { hf26: string, legacy: string } {
    if (packType === EPackType.UNKNOWN)
      return { hf26: this.transaction.sigDigest, legacy: this.transaction.legacy_sigDigest };

    const sigDigest = packType === EPackType.HF26 ? this.transaction.sigDigest : this.transaction.legacy_sigDigest;

    if (typeof sigDigest === 'undefined')
      throw new Error('Signature digest not found');

    return sigDigest;
  }

  private getRequiredAuthorities (): TTransactionRequiredAuthorities {
    const requiredAuthorities = this.transaction.requiredAuthorities;

    if (typeof requiredAuthorities === 'undefined')
      throw new Error('Required authorities not found');

    return requiredAuthorities;
  }

  private async getRequiredAuthoritiesForOperation (trx: ApiTransaction, operationIndex: number): Promise<TTransactionRequiredAuthorities> {
    const builtTx = this.chain.createTransactionFromJson(trx);

    if (trx.operations.length === 1)
      return builtTx.requiredAuthorities;

    // Ignore TaPoS as we do not check transaction validity, just extract the required authorities
    const tx = await this.chain.createTransaction(trx.expiration);

    tx.pushOperation(builtTx.transaction.operations[operationIndex]);

    return tx.requiredAuthorities;
  }

  private getAuthorityType (requiredAuthorities: TTransactionRequiredAuthorities): { level: EAuthorityLevel, accounts: Set<string> | authority[] }[] {
    const authLevels: { level: EAuthorityLevel, accounts: Set<string> | Array<authority> }[] = [];

    if (requiredAuthorities.owner.size !== 0)
      authLevels.push({ level: EAuthorityLevel.OWNER, accounts: requiredAuthorities.owner });

    if (requiredAuthorities.active.size !== 0)
      authLevels.push({ level: EAuthorityLevel.ACTIVE, accounts: requiredAuthorities.active });

    if (requiredAuthorities.posting.size !== 0)
      authLevels.push({ level: EAuthorityLevel.POSTING, accounts: requiredAuthorities.posting });

    return authLevels;
  }

  private getOperationsFromTransaction (trx: ApiTransaction): ApiOperation[] {
    const operations = trx.operations;

    if (typeof operations === 'undefined')
      throw new Error('Operations not found');

    return operations;
  }

  private async findSigneesForKeys (keys: string[]): Promise<string[][]> {
    const { accounts } = await this.chain.api.account_by_key_api.get_key_references({ keys });

    if (typeof accounts === 'undefined')
      throw new Error('Signees not found');

    return accounts;
  }

  private async checkVerifyAuthority (trx: ApiTransaction, packType: EPackType): Promise<boolean> {
    try {
      return (
        await this.chain.extend<TVerifyAuthority>().api.database_api.verify_authority({
          trx,
          pack: packType
        })
      ).valid;
    } catch {
      return false;
    }
  }

  // Method required for the authority path algorithm
  public async getAccountsFromId (id: string): Promise<{ accounts: ApiAccount[] }> {
    return (await this.chain.api.database_api.find_accounts({ accounts: [id] }));
  }
}

/**
 * The `TxInspectorEngine` class is the main class that is responsible for creating the `TransactionAnalyzer` instance
 *
 * To create instance of the class, you should call the {@link create} method,
 * which takes chain id and api ednpoint as arguments for the wax chain initialization.
 *
 * `TxInspectorEngine` provides two main methods:
 * - `processTransaction` - process transaction provided in JSON API format
 * - `processTransactionId` - fetch transaction from the Node API by id and process it
 *
 * You can also change the chain configuration by calling the `changeChainId` and `changeApiEndpoint` methods,
 * which will than reinitialize the chain and analyze the transaction once again if its id provided.
 */
class TxInspectorEngine {
  private chain: TWaxExtended<TChainExtendedApiData>;
  private chainId: string;
  private apiEndpoint: string;

  private constructor (chain: TWaxExtended<TChainExtendedApiData>, chainId: string, apiEndpoint: string) {
    this.chain = chain;
    this.chainId = chainId;
    this.apiEndpoint = apiEndpoint;
  }

  public static async create (chainId: string, apiEndpoint: string): Promise<TxInspectorEngine> {
    const base = await createHiveChain({
      chainId,
      apiEndpoint
    });
    const extendedChain = base.extend<TChainExtendedApiData>();
    return new TxInspectorEngine(extendedChain, chainId, apiEndpoint);
  }

  private async reinitializeChain (): Promise<void> {
    const base = await createHiveChain({
      chainId: this.chainId,
      apiEndpoint: this.apiEndpoint
    });
    this.chain = base.extend<TChainExtendedApiData>();
  }

  public async changeApiEndpoint (apiEndpoint: string, id?: string): Promise<TProcessedTransaction | void> {
    this.apiEndpoint = apiEndpoint;

    await this.reinitializeChain();

    if (id)
      return this.processTransactionId(id);
  }

  public async changeChainId (chainId: string, id?: string): Promise<TProcessedTransaction | void> {
    this.chainId = chainId;

    await this.reinitializeChain();

    if (id)
      return this.processTransactionId(id);
  }

  public async processTransaction (transaction: ApiTransaction): Promise<TProcessedTransaction> {
    const analyzer = new TransactionAnalyzer(this.chain);
    return await analyzer.analyzeTransaction(transaction);
  }

  public async processTransactionId (id: string): Promise<TProcessedTransaction> {
    const transaction = await this.chain.api.account_history_api.get_transaction({ id });
    if (typeof transaction === 'undefined') throw new Error('Transaction not found');

    const analyzer = new TransactionAnalyzer(this.chain);
    return await analyzer.analyzeTransaction(transaction, id);
  }

  public get extendedChain (): TWaxExtended<TChainExtendedApiData> {
    return this.chain;
  }
}

const txInspector = await (TxInspectorEngine).create('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

export default defineNuxtPlugin(() => {
  return {
    provide: {
      txInspector,
      chain: txInspector.extendedChain
    }
  };
});
