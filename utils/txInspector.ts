import { type ApiAccount, type ApiOperation, type ApiTransaction, createHiveChain, type IAuthorityPathEntry, type IAuthorityPathTraceData, type IBinaryViewOutputData, isPublicKey, type ITransaction, type IVerifyAuthorityTrace, type TWaxExtended } from '@hiveio/wax';
import { EAuthorityLevel, EPackType, type TChainExtendedApiData, type ITransactionAnalyzerApi, type IProcessedTransaction, type ISignatureData, type ITransactionData, type IRequiredAuthoritiesData, ESatisfiedState, type ITransactionBodyData, type ITransactionOtherData, type ITransactionRequiredAuthorities, type IAuthorityTypeData, type IAuthorityGraphData, type IAuthorityGraphFullCollectedData, type ISignatureTraceData } from '../types/wax';

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
    // Pasted JSON may omit the empty `extensions`, which wax (since 1.28) rejects
    const tx = this.chain.createTransactionFromJson({ ...transaction, extensions: transaction.extensions ?? [] });

    this.transaction = tx;

    const tapos = this.getTapos();
    const expirationTime = this.getExpiration();
    const signatures = transaction.signatures;
    const requiredAuthorities = await this.getRequiredAuthorities();
    const operations = this.getOperationsFromTransaction();
    const operationsWithBinaryViews = this.getOperationsWithBinaryViews(operations);
    const packType = await this.getPackType(requiredAuthorities, id);
    // A per-signature pack type list may be shorter than the signatures it is indexed by
    const packTypeAt = (index: number): EPackType => (Array.isArray(packType) ? packType[index] : packType) ?? EPackType.UNKNOWN;
    const primaryPackType = packTypeAt(0);
    const signatureRow = (signature: string, index: number): ISignatureData => ({
      signature,
      packType: packTypeAt(index),
      publicKey: this.getSignatureKeys(packTypeAt(index))[index] ?? ''
    });
    const authorityTrace = await this.verifyAuthorityTrace(primaryPackType);
    const graphData = this.generateGraphData(authorityTrace, signatures);

    const signatureKeys = this.getSignatureKeys(primaryPackType);
    const transactionId = this.getTransactionId(primaryPackType);
    const sigDigest = this.getSigDigest(primaryPackType);
    const isValid = await this.checkVerifyAuthority(primaryPackType);

    const authorityType = this.getAuthorityType(requiredAuthorities);
    const signeesByKeys = await this.findSigneesForKeys(signatureKeys);

    const matchingSignatures = this.getMatchingSignature(authorityType[0].accounts, authorityTrace.collectedData);

    const satisfied = await this.isSatisfied(requiredAuthorities, authorityTrace);

    const signatureData: ISignatureTraceData[] = [];

    const notMatchingSignatures = signatures.filter(sig => authorityTrace.collectedData.every(entry => !entry.matchingSignatures.some(matchingSig => matchingSig.signature === sig)));

    graphData.forEach((entry) => {
      const rows: ISignatureData[] = [];

      signatures.forEach((signature, index) => {
        if ('data' in entry)
          if (entry.matchingSignatures.length === 1 && entry.matchingSignatures[0]?.signature === signature)
            rows.push(signatureRow(signature, index));
          else
            entry.matchingSignatures.forEach((sig, key) => {
              if (sig.signature === signature)
                rows.push(signatureRow(signature, key));
            });
        else
          rows.push(signatureRow(signature, index));
      });

      signatureData.push({
        rows,
        graphData: entry
      });
    });

    if (notMatchingSignatures.length > 0) {
      const reasons: string[] = [];

      authorityTrace.collectedData.forEach((entry) => {
        const processingStatus = entry.finalAuthorityPath.processingStatus;

        if (!processingStatus.entryAccepted) {
          if (entry.matchingSignatures.length === 0)
            reasons.push('No required authority matched to given signature.');

          if (processingStatus.accountAuthorityCountExceeded)
            reasons.push('Path entry processing has been interrupted by crossing total number of processed account redirections.');

          if (processingStatus.accountAuthorityPointsMissingAccount)
            reasons.push('Path entry points to the account not known by the blockchain.');

          if (processingStatus.accountAuthorityProcessingDepthExceeded)
            reasons.push('Path entry processing has been interrupted by crossing recursion limit.');

          if (processingStatus.hasAccountAuthorityCycle)
            reasons.push('Path entry created a cycle while processig authority account redirection.');

          if (processingStatus.hasInsufficientWeight)
            reasons.push('Path entry matched, but the weight was insufficient.');
        }
      });

      notMatchingSignatures.forEach((signature) => {
        const rows: ISignatureData[] = [];

        rows.push({
          signature,
          packType: EPackType.UNKNOWN,
          publicKey: signatureKeys[signatures.indexOf(signature)] ?? ''
        });

        signatureData.push({
          rows,
          graphData: {
            message: 'Authority failure!',
            reasons
          }
        });
      });
    }

    const transactionData: ITransactionData = {
      id: transactionId,
      sigDigest,
      tapos,
      expirationTime
    };

    const requiredAuthoritiesData: IRequiredAuthoritiesData[] = [];

    for (const authority of authorityType)
      for (const [i, authorityAccount] of authority.accounts.entries())
        requiredAuthoritiesData.push({
          matchingSignature: (matchingSignatures.length === 1 ? matchingSignatures[0] : matchingSignatures[i]) ?? 'Missing signature',
          authorityAccount,
          authorityType: authority.level,
          isSatisfied: satisfied
        });

    const transactionBodyData: ITransactionBodyData[] = [];

    for (const [i, { operation, binaryView, legacyBinaryView }] of operationsWithBinaryViews.entries())
      for (const authority of this.getAuthorityType(await this.getRequiredAuthoritiesForOperation(i))) {
        // An authority with an account per operation contributes only the account of this one
        const authorityAccounts = authority.accounts.length >= operations.length ? authority.accounts.slice(i, i + 1) : authority.accounts;

        for (const authorityAccount of authorityAccounts)
          transactionBodyData.push({
            authorityAccount,
            authorityType: authority.level,
            isSatisfied: await this.isSatisfiedForOperation(authorityTrace, i),
            operationType: operation.type,
            operationContent: operation.value,
            operationsBinaryView: binaryView,
            operationsLegacyBinaryView: legacyBinaryView
          });
      }

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

        for (const [account] of accounts)
          if (account !== undefined && requiredAuthoritiesArray.includes(account))
            packTypeArray.push(EPackType.HF26);

        return packTypeArray;
      }

      if (id === this.transaction.legacy_id) {
        signatureKeys = this.transaction.legacy_signatureKeys;

        const { accounts } = await this.api.getKeyReferences({ keys: signatureKeys });

        for (const [account] of accounts)
          if (account !== undefined && requiredAuthoritiesArray.includes(account))
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
    const operation = this.transaction.transaction.operations[operationIndex];

    if (operation === undefined)
      throw new Error('Cannot get required authorities for operation');

    const tx = this.chain.createTransactionFromProto(this.transaction.transaction);

    tx.pushOperation(operation);

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

  private getAuthorityType (requiredAuthorities: ITransactionRequiredAuthorities): [IAuthorityTypeData, ...IAuthorityTypeData[]] {
    const authLevels: { level: EAuthorityLevel, accounts: string[] }[] = [];

    if (requiredAuthorities.owner && requiredAuthorities.owner.size !== 0)
      authLevels.push({ level: EAuthorityLevel.OWNER, accounts: Array.from(requiredAuthorities.owner) });

    if (requiredAuthorities.active && requiredAuthorities.active.size !== 0)
      authLevels.push({ level: EAuthorityLevel.ACTIVE, accounts: Array.from(requiredAuthorities.active) });

    if (requiredAuthorities.posting && requiredAuthorities.posting.size !== 0)
      authLevels.push({ level: EAuthorityLevel.POSTING, accounts: Array.from(requiredAuthorities.posting) });

    if (requiredAuthorities.other && requiredAuthorities.other.size !== 0)
      authLevels.push({ level: EAuthorityLevel.OTHER, accounts: Array.from(requiredAuthorities.other) });

    const [firstLevel = { level: EAuthorityLevel.OTHER, accounts: ['None'] }, ...otherLevels] = authLevels;

    return [firstLevel, ...otherLevels];
  }

  private getOperationsFromTransaction (): ApiOperation[] {
    const operations = this.transaction.toApiJson().operations;

    if (typeof operations === 'undefined')
      throw new Error('Operations not found');

    return operations;
  }

  private getMatchingSignature (authorityAccounts: string[], authorityTrace: IAuthorityPathTraceData[]): Array<string[] | string> {
    const matchingSignatures: Array<string[] | string> = [];

    if (authorityAccounts[0] === 'None')
      return ['None'];

    for (const account of authorityAccounts) {
      const entryFound = authorityTrace.find(entry => entry.finalAuthorityPath.processedEntry === account);

      if (!entryFound)
        return ['Missing signature'];

      const [firstSignature, ...otherSignatures] = entryFound.matchingSignatures;

      if (firstSignature === undefined)
        if (entryFound.finalAuthorityPath.processingStatus.entryAccepted)
          matchingSignatures.push('Open authority');
        else
          matchingSignatures.push('Missing signature');
      else
        if (otherSignatures.length > 0)
          matchingSignatures.push(entryFound.matchingSignatures.map(sig => sig.signature));
        else
          matchingSignatures.push(firstSignature.signature);
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
      if (isPublicKey(visitedEntry.processedEntry))
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

  private generateGraphData (authorityTrace: IVerifyAuthorityTrace, signatures: string[]): Array<IAuthorityGraphFullCollectedData> {
    const fullCollectedData: Array<IAuthorityGraphFullCollectedData> = [];
    const sortedData: Array<IAuthorityPathTraceData> = [];

    signatures.forEach((signature) => {
      authorityTrace.collectedData.forEach((entry) => {
        const item = entry.matchingSignatures.find(sig => sig.signature === signature);

        if (item && !sortedData.find(data => JSON.stringify(data) === JSON.stringify(entry)))
          sortedData.push(entry);
      });
    });

    for (const entry of sortedData)
      fullCollectedData.push({ data: this.convertEntryTraceData(entry.finalAuthorityPath), level: entry.finalAuthorityPath.processedRole, matchingSignatures: entry.matchingSignatures });

    return fullCollectedData;
  }

  private async isSatisfied (requiredAuthorities: ITransactionRequiredAuthorities, authorityTrace: IVerifyAuthorityTrace): Promise<ESatisfiedState[]> {
    const isSatisfiedArray: ESatisfiedState[] = [];

    for (const entry of authorityTrace.collectedData) {
      const requiredAuthLevel = entry.finalAuthorityPath.processedRole;

      const requiredAuthArr = Array.from(requiredAuthorities[requiredAuthLevel as keyof ITransactionRequiredAuthorities]);

      if (requiredAuthArr.length === 0)
        isSatisfiedArray.push(ESatisfiedState.FALSE);

      const foundEntry = requiredAuthArr.find((auth) => {
        return auth === entry.finalAuthorityPath.processedEntry;
      });

      if (foundEntry && entry.finalAuthorityPath.processingStatus.entryAccepted)
        isSatisfiedArray.push(ESatisfiedState.TRUE);

      if (foundEntry &&
          entry.finalAuthorityPath.processingStatus.entryAccepted === false &&
          await this.chain.api.account_history_api.get_transaction({ id: this.transaction.id }))
        isSatisfiedArray.push(ESatisfiedState.BLOCKCHAIN_FORCED_TRUE);
    }

    return isSatisfiedArray;
  }

  private async isSatisfiedForOperation (authorityTrace: IVerifyAuthorityTrace, index: number): Promise<ESatisfiedState[]> {
    const isSatisfiedArray: ESatisfiedState[] = [];

    for (const entry of authorityTrace.collectedData) {
      const requiredAuthLevel = entry.finalAuthorityPath.processedRole;

      const requiredAuthArr = Array.from((await this.getRequiredAuthoritiesForOperation(index))[requiredAuthLevel as keyof ITransactionRequiredAuthorities]);

      if (requiredAuthArr.length === 0)
        isSatisfiedArray.push(ESatisfiedState.FALSE);

      const foundEntry = requiredAuthArr.find((auth) => {
        return auth === entry.finalAuthorityPath.processedEntry;
      });

      if (foundEntry && entry.finalAuthorityPath.processingStatus.entryAccepted)
        isSatisfiedArray.push(ESatisfiedState.TRUE);

      if (foundEntry &&
        entry.finalAuthorityPath.processingStatus.entryAccepted === false &&
        await this.chain.api.account_history_api.get_transaction({ id: this.transaction.id }))
        isSatisfiedArray.push(ESatisfiedState.BLOCKCHAIN_FORCED_TRUE);
    }

    return isSatisfiedArray;
  }

  private getOperationsWithBinaryViews (operations: ApiOperation[]): { operation: ApiOperation, binaryView: IBinaryViewOutputData, legacyBinaryView: IBinaryViewOutputData }[] {
    return operations.map(operation => ({
      operation,
      binaryView: this.chain.operationBinaryViewMetadata(operation, true),
      legacyBinaryView: this.chain.operationBinaryViewMetadata(operation, false)
    }));
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
