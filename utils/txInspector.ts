import { ApiAccount, ApiOperation, type ApiTransaction, authority, createHiveChain, type ITransaction, type TTransactionRequiredAuthorities, type TWaxExtended } from '@hiveio/wax';
import { EAuthorityLevel, EPackType, type TProcessedTransaction, type TChainExtendedApiData, type ITransactionAnalyzerApi } from '../types/wax';
import { type IAuthorityPaths, getAuthorityPath } from './getAuthorityPath';

export class TransactionAnalyzerApiProvider implements ITransactionAnalyzerApi {
  private readonly chain: TWaxExtended<TChainExtendedApiData>;
  private cache: Map<string, any>;

  public constructor (chain: TWaxExtended<TChainExtendedApiData>) {
    this.chain = chain;
    this.cache = new Map();
  }

  public async verifyAuthority (params: { trx: ApiTransaction, pack: EPackType }): Promise<{ valid: boolean }> {
    const key = `verifyAuthority-${JSON.stringify(params.trx)}-${params.pack}`;

    if (this.cache.has(key))
      return this.cache.get(key);

    const response = await this.chain.api.database_api.verify_authority(params);

    this.cache.set(key, response);

    return response;
  }

  public async getKeyReferences (params: { keys: string[] }): Promise<{ accounts: string[][] }> {
    const key = `getKeyReferences-${params.keys.join('-')}`;

    if (this.cache.has(key))
      return this.cache.get(key);

    const response = await this.chain.api.account_by_key_api.get_key_references(params);

    this.cache.set(key, response);

    return response;
  }

  public async findAccounts (params: { accounts: string[] }): Promise<{ accounts: ApiAccount[] }> {
    const key = `findAccounts-${params.accounts.join('-')}`;

    if (this.cache.has(key))
      return this.cache.get(key);

    const response = await this.chain.api.database_api.find_accounts(params);

    this.cache.set(key, response);

    return response;
  }
}

/**
 * The `TransactionAnalyzer` class is responsible for analyzing a transaction and extracting all the necessary information from it.
 *
 * It takes the hive chain object in the constructor which is responsible for communication with the blockchain api.
 *
 * It provides a method {@link analyzeTransaction} which is responsible for returning all the information about the transaction.
 */
export class TransactionAnalyzer {
  private readonly chain: TWaxExtended<TChainExtendedApiData>;
  private readonly api: ITransactionAnalyzerApi;
  private transaction!: ITransaction;

  public constructor (chain: TWaxExtended<TChainExtendedApiData>, api: ITransactionAnalyzerApi) {
    this.chain = chain;
    this.api = api;
  }

  /**
   * Takes the transaction and analyzes it to get all the necessary information
   * @see {@link TProcessedTransaction} for the return type
   *
   * @param {ApiTransaction} transaction Transaction body i.e. received from Hive APIs. Should conform HF26 JSON format.
   * @param {?string} id Optional input transaction hash (id) used to query Hive blockchain for actual transaction body.
   *                     Once provided, allows to perform more strict checks specific to i.e. transaction pack type (legacy or HF26)
   *
   * @returns {TProcessedTransaction} object with all information about the transaction.
   */
  public async analyzeTransaction (transaction: ApiTransaction, id?: string): Promise<TProcessedTransaction> {
    const tx = this.chain.createTransactionFromJson(transaction);

    this.transaction = tx;

    const packType = await this.getPackType(id);
    const signatures = transaction.signatures;
    const signatureKeys = this.getSignatureKeys(packType);
    const transactionId = this.getTransactionId(packType);
    const sigDigest = this.getSigDigest(packType);
    const requiredAuthorities = this.getRequiredAuthorities();
    const requiredAuthoritiesForOperations = this.getRequiredAuthoritiesForOperation();
    const authorityType = this.getAuthorityType(requiredAuthorities);
    const operations = this.getOperationsFromTransaction();
    const signeesByKeys = await this.findSigneesForKeys(signatureKeys);
    const isValid = await this.checkVerifyAuthority(packType);
    const tapos = this.getTapos();
    const expiration = this.getExpiration();
    const { authorityPath, isSatisfied } = await this.getAuthorityPath(requiredAuthorities, signatureKeys);
    const satisfied = await this.isSatisfied(signatures, isValid, signatureKeys, isSatisfied);
    const isSatisfiedForOperation = await this.isSatisfiedForOperation(signatures, isValid, signatureKeys, isSatisfied, requiredAuthoritiesForOperations);

    return {
      packType,
      signatures,
      signatureKeys,
      transactionId,
      sigDigest,
      requiredAuthorities,
      requiredAuthoritiesForOperations,
      authorityType,
      operations,
      signeesByKeys,
      isValid,
      tapos,
      expiration,
      transaction: this.transaction,
      protoTransaction: tx.transaction,
      authorityPath,
      isSatisfied: satisfied,
      isSatisfiedForOperation
    } as TProcessedTransaction;
  }

  private async getPackType (id?: string): Promise<EPackType> {
    if (this.api.getPackType)
      return this.api.getPackType();

    if (id) {
      if (id === this.transaction.id)
        return EPackType.HF26;

      if (id === this.transaction.legacy_id)
        return EPackType.LEGACY;

      return EPackType.UNKNOWN;
    }

    try {
      await this.api.verifyAuthority({
        trx: this.transaction.toApiJson(),
        pack: EPackType.HF26
      });
      return EPackType.HF26;
    } catch {
      try {
        await this.api.verifyAuthority({
          trx: this.transaction.toApiJson(),
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

  private getRequiredAuthoritiesForOperation (): TTransactionRequiredAuthorities | TTransactionRequiredAuthorities[] {
    if (this.transaction.transaction.operations.length === 1)
      return this.transaction.requiredAuthorities;

    const requiredAuthoritiesArray: TTransactionRequiredAuthorities[] = [];

    for (let i = 0; i < this.transaction.transaction.operations.length; ++i) {
      const tx = this.chain.createTransactionFromProto(this.transaction.transaction);

      tx.pushOperation(this.transaction.transaction.operations[i]);

      requiredAuthoritiesArray.push(tx.requiredAuthorities);
    }

    return requiredAuthoritiesArray;
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

  private getOperationsFromTransaction (): ApiOperation[] {
    const operations = this.transaction.toApiJson().operations;

    if (typeof operations === 'undefined')
      throw new Error('Operations not found');

    return operations;
  }

  private async findSigneesForKeys (keys: string[]): Promise<string[][]> {
    const { accounts } = await this.api.getKeyReferences({ keys });

    if (typeof accounts === 'undefined')
      throw new Error('Signees not found');

    return accounts;
  }

  private async checkVerifyAuthority (packType: EPackType): Promise<boolean> {
    try {
      return (
        await this.api.verifyAuthority({
          trx: this.transaction.toApiJson(),
          pack: packType
        })
      ).valid;
    } catch {
      return false;
    }
  }

  private getTapos (): { refBlockNum: number, refBlockPrefix: number } {
    return {
      refBlockNum: this.transaction.transaction.ref_block_num,
      refBlockPrefix: this.transaction.transaction.ref_block_prefix
    };
  }

  private getExpiration (): string {
    return this.transaction.transaction.expiration;
  }

  private async getAuthorityPath (requiredAuthorities: TTransactionRequiredAuthorities, signatureKeys: string[]): Promise<{ authorityPath: IAuthorityPaths[], isSatisfied: boolean }> {
    const authorityPath = await getAuthorityPath(this, requiredAuthorities, signatureKeys);

    if (authorityPath) {
      authorityPath.push(authorityPath.shift()!);

      let totalWeight = 0;
      let totalThreshold = 0;

      let isSatisfied!: boolean;

      for (let i = 0; i < authorityPath.length; ++i)
        if (authorityPath[i].authWeight) {
          totalWeight += authorityPath[i].authWeight!.auth;
          totalThreshold += authorityPath[i].authWeight!.weight;
        }

      if (totalWeight >= totalThreshold)
        isSatisfied = true;
      else
        isSatisfied = false;

      return { authorityPath, isSatisfied };
    }

    return { authorityPath: [], isSatisfied: false };
  }

  private async isSatisfied (signatures: string[], isValid: boolean, keys: string[], isSatisfiedFromPath: boolean): Promise<boolean> {
    if (signatures.length === 0)
      if (isValid)
        return true;
      else
        return false;

    const requiredAuthorities = this.transaction.requiredAuthorities;
    const keyReferences = await this.api.getKeyReferences({ keys });

    if (keyReferences.accounts === null || keyReferences.accounts[0].length === 0)
      return false;

    const { accounts } = await this.api.findAccounts({ accounts: keyReferences.accounts[0] });

    let requiredAuthLevel!: EAuthorityLevel;

    if (requiredAuthorities.owner.size !== 0)
      requiredAuthLevel = EAuthorityLevel.OWNER;
    else if (requiredAuthorities.active.size !== 0)
      requiredAuthLevel = EAuthorityLevel.ACTIVE;
    else if (requiredAuthorities.posting.size !== 0)
      requiredAuthLevel = EAuthorityLevel.POSTING;
    else
      requiredAuthLevel = EAuthorityLevel.OTHER;

    for (let i = 0; i < keys.length; ++i)
      if (isSatisfiedFromPath && accounts[0][requiredAuthLevel.toLowerCase()].key_auths[0][0] === keys[i])
        return true;

    return false;
  }

  private async isSatisfiedForOperation (signatures: string[], isValid: boolean, keys: string[], isSatisfiedFromPath: boolean, requiredAuthoritiesForOperations: TTransactionRequiredAuthorities | TTransactionRequiredAuthorities[]): Promise<boolean[]> {
    if (Array.isArray(requiredAuthoritiesForOperations)) {
      const isSatisfiedArray: boolean[] = [];

      for (let i = 0; i < requiredAuthoritiesForOperations.length; ++i) {
        const requiredAuthorities = requiredAuthoritiesForOperations[i];
        const keyReferences = await this.api.getKeyReferences({ keys });

        if (keyReferences.accounts === null || keyReferences.accounts[0].length === 0)
          isSatisfiedArray.push(false);

        const { accounts } = await this.api.findAccounts({ accounts: keyReferences.accounts[0] });

        let requiredAuthLevel!: EAuthorityLevel;

        if (requiredAuthorities.owner.size !== 0)
          requiredAuthLevel = EAuthorityLevel.OWNER;
        else if (requiredAuthorities.active.size !== 0)
          requiredAuthLevel = EAuthorityLevel.ACTIVE;
        else if (requiredAuthorities.posting.size !== 0)
          requiredAuthLevel = EAuthorityLevel.POSTING;
        else
          requiredAuthLevel = EAuthorityLevel.OTHER;

        for (let j = 0; j < keys.length; ++j)
          if (isSatisfiedFromPath && accounts[0][requiredAuthLevel.toLowerCase()].key_auths[0][j] === keys[j])
            isSatisfiedArray.push(true);
      }

      return isSatisfiedArray;
    }

    return [await this.isSatisfied(signatures, isValid, keys, isSatisfiedFromPath)];
  }

  // Method required for the authority path algorithm
  public async getAccountsFromId (id: string): Promise<{ accounts: ApiAccount[] }> {
    return (await this.api.findAccounts({ accounts: [id] }));
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
export class TxInspectorEngine {
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

  public async changeConfig (chainId: string, apiEndpoint: string, id?: string, json?: ApiTransaction): Promise<TProcessedTransaction | void> {
    this.chainId = chainId;
    this.apiEndpoint = apiEndpoint;

    await this.reinitializeChain();

    if (id)
      return this.processTransactionId(id);

    if (json)
      return this.processTransaction(json);
  }

  public async processTransaction (transaction: ApiTransaction): Promise<TProcessedTransaction> {
    const analyzer = new TransactionAnalyzer(this.chain, new TransactionAnalyzerApiProvider(this.chain));
    return await analyzer.analyzeTransaction(transaction);
  }

  public async processTransactionId (id: string): Promise<TProcessedTransaction> {
    const transaction = await this.chain.api.account_history_api.get_transaction({ id });
    if (typeof transaction === 'undefined') throw new Error('Transaction not found');

    const analyzer = new TransactionAnalyzer(this.chain, new TransactionAnalyzerApiProvider(this.chain));
    return await analyzer.analyzeTransaction(transaction, id);
  }

  public async processTransactionBinary (binary: string): Promise<TProcessedTransaction> {
    const tx = this.chain.convertTransactionFromBinaryForm(binary);
    const analyzer = new TransactionAnalyzer(this.chain, new TransactionAnalyzerApiProvider(this.chain));

    return await analyzer.analyzeTransaction(tx);
  }

  public get extendedChain (): TWaxExtended<TChainExtendedApiData> {
    return this.chain;
  }

  public get config (): { chainId: string, apiEndpoint: string } {
    return { chainId: this.chainId, apiEndpoint: this.apiEndpoint };
  }
}
