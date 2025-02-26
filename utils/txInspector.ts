import { ApiAccount, ApiOperation, type ApiTransaction, createHiveChain, type IAuthorityPathEntry, type IAuthorityPathTraceData, type IBinaryViewOutputData, type ITransaction, type IVerifyAuthorityTrace, type TWaxExtended } from '@hiveio/wax/vite';
import { EAuthorityLevel, EPackType, type TChainExtendedApiData, type ITransactionAnalyzerApi, type IProcessedTransaction, type ISignatureData, type ITransactionData, type IRequiredAuthoritiesData, ESatisfiedState, type ITransactionBodyData, type ITransactionOtherData, type ITransactionRequiredAuthorities, type IAuthorityTypeData, type IAuthorityGraphData, type IAuthorityGraphFullCollectedData } from '../types/wax';

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
   * @see {@link IProcessedTransaction} for the return type
   *
   * @param {ApiTransaction} transaction Transaction body i.e. received from Hive APIs. Should conform HF26 JSON format.
   * @param {?string} id Optional input transaction hash (id) used to query Hive blockchain for actual transaction body.
   *                     Once provided, allows to perform more strict checks specific to i.e. transaction pack type (legacy or HF26)
   *
   * @returns {IProcessedTransaction} object with all information about the transaction.
   */
  public async analyzeTransaction (transaction: ApiTransaction, id?: string): Promise<IProcessedTransaction> {
    const tx = this.chain.createTransactionFromJson(transaction);

    this.transaction = tx;

    const tapos = this.getTapos();
    const expirationTime = this.getExpiration();
    const signatures = transaction.signatures;
    const requiredAuthorities = await this.getRequiredAuthorities();
    const operations = this.getOperationsFromTransaction();
    const operationsBinaryView = this.getOperationsBinaryView(operations);
    const operationsLegacyBinaryView = this.getLegacyOperationsBinaryView(operations);
    const packType = await this.getPackType(requiredAuthorities, id);
    const authorityTrace = await this.verifyAuthorityTrace(Array.isArray(packType) ? packType[0] : packType);
    const graphData = this.generateGraphData(authorityTrace, signatures);

    const signatureKeys = this.getSignatureKeys(Array.isArray(packType) ? packType[0] : packType);
    const transactionId = this.getTransactionId(Array.isArray(packType) ? packType[0] : packType);
    const sigDigest = this.getSigDigest(Array.isArray(packType) ? packType[0] : packType);
    const isValid = await this.checkVerifyAuthority(Array.isArray(packType) ? packType[0] : packType);

    const authorityType = this.getAuthorityType(requiredAuthorities);
    const signeesByKeys = await this.findSigneesForKeys(signatureKeys);

    const matchingSignatures = this.getMatchingSignature(authorityType[0].accounts, authorityTrace.collectedData);

    const satisfied = this.isSatisfied(requiredAuthorities, authorityTrace);

    const signatureData: ISignatureData[] = [];

    for (let i = 0; i < signatures.length; ++i)
      signatureData.push({
        signature: signatures[i],
        packType: Array.isArray(packType) ? packType[i] : packType,
        publicKey: this.getSignatureKeys(Array.isArray(packType) ? packType[i] : packType)[i],
        authorityTrace,
        graphData
      });

    const transactionData: ITransactionData = {
      id: transactionId,
      sigDigest,
      tapos,
      expirationTime
    };

    const requiredAuthoritiesData: IRequiredAuthoritiesData[] = [];

    for (const authority of authorityType)
      for (let i = 0; i < authority.accounts.length; ++i)
        requiredAuthoritiesData.push({
          matchingSignature: matchingSignatures.length === 1 ? matchingSignatures[0] : matchingSignatures[i],
          authorityAccount: authority.accounts[i],
          authorityType: authority.level,
          isSatisfied: satisfied
        });

    const transactionBodyData: ITransactionBodyData[] = [];

    for (let i = 0; i < operations.length; ++i)
      for (const authority of this.getAuthorityType(await this.getRequiredAuthoritiesForOperation(i)))
        if (authority.accounts.length >= operations.length)
          transactionBodyData.push({
            authorityAccount: authority.accounts[i],
            authorityType: authority.level,
            isSatisfied: await this.isSatisfiedForOperation(authorityTrace, i),
            operationType: operations[i].type,
            operationContent: operations[i].value,
            operationsBinaryView: operationsBinaryView[i],
            operationsLegacyBinaryView: operationsLegacyBinaryView[i]
          });
        else
          for (let j = 0; j < authority.accounts.length; ++j)
            transactionBodyData.push({
              authorityAccount: authority.accounts[j],
              authorityType: authority.level,
              isSatisfied: await this.isSatisfiedForOperation(authorityTrace, i),
              operationType: operations[i].type,
              operationContent: operations[i].value,
              operationsBinaryView: operationsBinaryView[i],
              operationsLegacyBinaryView: operationsLegacyBinaryView[i]
            });

    const transactionOtherData: ITransactionOtherData = {
      isValid,
      transaction: this.transaction,
      signeesByKeys
    };

    return {
      signatureData,
      transactionData,
      requiredAuthoritiesData,
      transactionBodyData,
      transactionOtherData
    };
  }

  private async getPackType (requiredAuthorities: ITransactionRequiredAuthorities, id?: string): Promise<EPackType | EPackType[]> {
    const packTypeArray: EPackType[] = [];

    const requiredAuthoritiesArray = [...requiredAuthorities.active, ...requiredAuthorities.owner, ...requiredAuthorities.posting];

    let signatureKeys!: string[];

    if (this.api.getPackType)
      return this.api.getPackType();

    if (this.transaction.id === this.transaction.legacy_id)
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

    if (id) {
      if (id === this.transaction.id && id !== this.transaction.legacy_id)
        return EPackType.HF26;

      if (id === this.transaction.legacy_id && id !== this.transaction.id)
        return EPackType.LEGACY;

      if (id === this.transaction.id) {
        signatureKeys = this.transaction.signatureKeys;

        const { accounts } = await this.api.getKeyReferences({ keys: signatureKeys });

        for (const account of accounts)
          if (requiredAuthoritiesArray.includes(account[0]))
            packTypeArray.push(EPackType.HF26);

        return packTypeArray;
      }

      if (id === this.transaction.legacy_id) {
        signatureKeys = this.transaction.legacy_signatureKeys;

        const { accounts } = await this.api.getKeyReferences({ keys: signatureKeys });

        for (const account of accounts)
          if (requiredAuthoritiesArray.includes(account[0]))
            packTypeArray.push(EPackType.LEGACY);

        return packTypeArray;
      }

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

  private getSignatureKeys (packType: string): string[] {
    const signatureKeys =
      packType === EPackType.HF26 ? this.transaction.signatureKeys : this.transaction.legacy_signatureKeys;

    if (typeof signatureKeys === 'undefined')
      throw new Error('Signature keys not found');

    return signatureKeys;
  }

  private getTransactionId (packType: string): string | { hf26: string, legacy: string } {
    if (packType === EPackType.UNKNOWN)
      return { hf26: this.transaction.id, legacy: this.transaction.legacy_id };

    const id = packType === EPackType.HF26 ? this.transaction.id : this.transaction.legacy_id;

    if (typeof id === 'undefined')
      throw new Error('Transaction ID not found');

    return id;
  }

  private getSigDigest (packType: string): string | { hf26: string, legacy: string } {
    if (packType === EPackType.UNKNOWN)
      return { hf26: this.transaction.sigDigest, legacy: this.transaction.legacy_sigDigest };

    const sigDigest = packType === EPackType.HF26 ? this.transaction.sigDigest : this.transaction.legacy_sigDigest;

    if (typeof sigDigest === 'undefined')
      throw new Error('Signature digest not found');

    return sigDigest;
  }

  private async getRequiredAuthorities (): Promise<ITransactionRequiredAuthorities> {
    const requiredAuthorities = this.transaction.requiredAuthorities;

    if (typeof requiredAuthorities === 'undefined')
      throw new Error('Required authorities not found');

    const result: ITransactionRequiredAuthorities = {
      posting: requiredAuthorities.posting,
      active: requiredAuthorities.active,
      owner: requiredAuthorities.owner,
      other: new Set<string>()
    };

    if (requiredAuthorities.other.length > 0) {
      const requiredAuthoritiesSet = new Set<string>();

      for (const { key_auths: keyAuths } of requiredAuthorities.other)
        for (const key in keyAuths)
          requiredAuthoritiesSet.add(key);

      const { accounts: accountsPerKey } = await this.api.getKeyReferences({ keys: [...requiredAuthoritiesSet] });

      for (const accounts of accountsPerKey)
        for (const account of accounts)
          result.other.add(account);

      for (const { account_auths: accountAuths } of requiredAuthorities.other)
        for (const account in accountAuths)
          result.other.add(account);
    }

    return result;
  }

  private async getRequiredAuthoritiesForOperation (operationIndex: number): Promise<ITransactionRequiredAuthorities> {
    if (this.transaction.transaction.operations.length < operationIndex)
      throw new Error('Cannot get required authorities for operation');

    const tx = this.chain.createTransactionFromProto(this.transaction.transaction);

    tx.pushOperation(this.transaction.transaction.operations[operationIndex]);

    const requiredAuthorities = tx.requiredAuthorities;

    if (typeof requiredAuthorities === 'undefined')
      throw new Error('Required authorities not found');

    const result: ITransactionRequiredAuthorities = {
      posting: requiredAuthorities.posting,
      active: requiredAuthorities.active,
      owner: requiredAuthorities.owner,
      other: new Set<string>()
    };

    if (requiredAuthorities.other.length > 0) {
      const requiredAuthoritiesSet = new Set<string>();

      for (const { key_auths: keyAuths } of requiredAuthorities.other)
        for (const key in keyAuths)
          requiredAuthoritiesSet.add(key);

      const { accounts: accountsPerKey } = await this.api.getKeyReferences({ keys: [...requiredAuthoritiesSet] });

      for (const accounts of accountsPerKey)
        for (const account of accounts)
          result.other.add(account);

      for (const { account_auths: accountAuths } of requiredAuthorities.other)
        for (const account in accountAuths)
          result.other.add(account);
    }

    return result;
  }

  private getAuthorityType (requiredAuthorities: ITransactionRequiredAuthorities): IAuthorityTypeData[] {
    const authLevels: { level: EAuthorityLevel, accounts: string[] }[] = [];

    if (requiredAuthorities.owner && requiredAuthorities.owner.size !== 0)
      authLevels.push({ level: EAuthorityLevel.OWNER, accounts: Array.from(requiredAuthorities.owner) });

    if (requiredAuthorities.active && requiredAuthorities.active.size !== 0)
      authLevels.push({ level: EAuthorityLevel.ACTIVE, accounts: Array.from(requiredAuthorities.active) });

    if (requiredAuthorities.posting && requiredAuthorities.posting.size !== 0)
      authLevels.push({ level: EAuthorityLevel.POSTING, accounts: Array.from(requiredAuthorities.posting) });

    if (requiredAuthorities.other && requiredAuthorities.other.size !== 0)
      authLevels.push({ level: EAuthorityLevel.OTHER, accounts: Array.from(requiredAuthorities.other) });

    if (authLevels.length === 0)
      authLevels.push({ level: EAuthorityLevel.OTHER, accounts: ['None'] });

    return authLevels;
  }

  private getOperationsFromTransaction (): ApiOperation[] {
    const operations = this.transaction.toApiJson().operations;

    if (typeof operations === 'undefined')
      throw new Error('Operations not found');

    return operations;
  }

  private getMatchingSignature (authorityAccounts: string[], authorityTrace: IAuthorityPathTraceData[]): string[] {
    const matchingSignatures: string[] = [];

    if (authorityAccounts[0] === 'None')
      return ['None'];

    for (const account of authorityAccounts) {
      const foundEntry = authorityTrace.find((entry) => {
        return entry.finalAuthorityPath.processedEntry === account;
      });

      if (foundEntry)
        if (foundEntry.matchingSignature)
          matchingSignatures.push(foundEntry.matchingSignature.signature);
        else
          if (foundEntry.finalAuthorityPath.processingStatus.entryAccepted)
            matchingSignatures.push('Open authority');
          else
            matchingSignatures.push('Missing signature');
    }

    return matchingSignatures;
  }

  private async findSigneesForKeys (keys: string[]): Promise<string[][]> {
    const { accounts } = await this.api.getKeyReferences({ keys });

    if (typeof accounts === 'undefined')
      throw new Error('Signees not found');

    return accounts;
  }

  private async checkVerifyAuthority (packType: string): Promise<boolean> {
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

  private async verifyAuthorityTrace (packType: EPackType): Promise<IVerifyAuthorityTrace> {
    const tx = await this.chain.createTransaction();

    const isLegacy = packType === EPackType.LEGACY;

    const trace = await tx.generateAuthorityVerificationTrace(isLegacy, this.transaction);

    return trace;
  }

  private convertEntryTraceData (entry: IAuthorityPathEntry): IAuthorityGraphData[] {
    const elements: IAuthorityGraphData[] = [];

    for (const visitedEntry of entry.visitedEntries) {
      if (visitedEntry.processedEntry.startsWith('STM'))
        continue;

      elements.push(...this.convertEntryTraceData(visitedEntry));

      elements.push({
        data: {
          id: `${entry.processedEntry}-${visitedEntry.processedEntry}`,
          source: visitedEntry.processedEntry,
          target: entry.processedEntry
        }
      });
    }

    elements.push({
      data: {
        id: entry.processedEntry,
        label: `@${entry.processedEntry} (${entry.weight}/${entry.threshold})`
      }
    });

    return elements;
  }

  private generateGraphData (authorityTrace: IVerifyAuthorityTrace, signatures: string[]): Array<IAuthorityGraphFullCollectedData | string[]> {
    const fullCollectedData: Array<IAuthorityGraphFullCollectedData | string[]> = [];
    const sortedData: Array<IAuthorityPathTraceData | string> = [];

    signatures.forEach((signature: string) => {
      const foundEntry = authorityTrace.collectedData.find((entry) => {
        return entry.matchingSignature?.signature === signature;
      });

      if (foundEntry)
        sortedData.push(foundEntry);
      else
        sortedData.push('NOT_FOUND');
    });

    for (const entry of sortedData)
      if (typeof entry === 'string')
        fullCollectedData.push(['NOT_FOUND']);
      else
        fullCollectedData.push({ data: this.convertEntryTraceData(entry.finalAuthorityPath), level: entry.finalAuthorityPath.processedRole });

    return fullCollectedData;
  }

  private isSatisfied (requiredAuthorities: ITransactionRequiredAuthorities, authorityTrace: IVerifyAuthorityTrace): ESatisfiedState[] {
    const isSatisfiedArray: ESatisfiedState[] = [];

    for (const entry of authorityTrace.collectedData) {
      const requiredAuthLevel = entry.finalAuthorityPath.processedRole;

      const requiredAuthArr = Array.from(requiredAuthorities[requiredAuthLevel]);

      if (requiredAuthArr.length === 0)
        isSatisfiedArray.push(ESatisfiedState.FALSE);

      const foundEntry = requiredAuthArr.find((auth) => {
        return auth === entry.finalAuthorityPath.processedEntry;
      });

      if (foundEntry && entry.finalAuthorityPath.processingStatus.entryAccepted)
        isSatisfiedArray.push(ESatisfiedState.TRUE);
    }

    return isSatisfiedArray;
  }

  private async isSatisfiedForOperation (authorityTrace: IVerifyAuthorityTrace, index: number): Promise<ESatisfiedState[]> {
    const isSatisfiedArray: ESatisfiedState[] = [];

    for (const entry of authorityTrace.collectedData) {
      const requiredAuthLevel = entry.finalAuthorityPath.processedRole;

      const requiredAuthArr = Array.from((await this.getRequiredAuthoritiesForOperation(index))[requiredAuthLevel]);

      if (requiredAuthArr.length === 0)
        isSatisfiedArray.push(ESatisfiedState.FALSE);

      const foundEntry = requiredAuthArr.find((auth) => {
        return auth === entry.finalAuthorityPath.processedEntry;
      });

      if (foundEntry && entry.finalAuthorityPath.processingStatus.entryAccepted)
        isSatisfiedArray.push(ESatisfiedState.TRUE);
    }

    return isSatisfiedArray;
  }

  private getOperationsBinaryView (operations: ApiOperation[]): IBinaryViewOutputData[] {
    const binaryOperations: IBinaryViewOutputData[] = [];

    for (const operation of operations)
      binaryOperations.push(this.chain.operationBinaryViewMetadata(operation, true));

    return binaryOperations;
  }

  private getLegacyOperationsBinaryView (operations: ApiOperation[]): IBinaryViewOutputData[] {
    const binaryOperations: IBinaryViewOutputData[] = [];

    for (const operation of operations)
      binaryOperations.push(this.chain.operationBinaryViewMetadata(operation, false));

    return binaryOperations;
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

  public async changeConfig (chainId: string, apiEndpoint: string, id?: string, json?: ApiTransaction): Promise<IProcessedTransaction | void> {
    this.chainId = chainId;
    this.apiEndpoint = apiEndpoint;

    await this.reinitializeChain();

    if (id)
      return this.processTransactionId(id);

    if (json)
      return this.processTransaction(json);
  }

  public async processTransaction (transaction: ApiTransaction): Promise<IProcessedTransaction> {
    const analyzer = new TransactionAnalyzer(this.chain, new TransactionAnalyzerApiProvider(this.chain));
    return await analyzer.analyzeTransaction(transaction);
  }

  public async processTransactionId (id: string): Promise<IProcessedTransaction> {
    const transaction = await this.chain.api.account_history_api.get_transaction({ id });
    if (typeof transaction === 'undefined') throw new Error('Transaction not found');

    const analyzer = new TransactionAnalyzer(this.chain, new TransactionAnalyzerApiProvider(this.chain));
    return await analyzer.analyzeTransaction(transaction, id);
  }

  public async processTransactionBinary (binary: string): Promise<IProcessedTransaction> {
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
