/* eslint-disable no-console */
/* eslint-disable no-var */
import { createHiveChain } from '@hiveio/wax/vite';
import { TransactionAnalyzerApiProvider, TransactionAnalyzer, TxInspectorEngine } from '../../utils/txInspector.js';
import type { TChainExtendedApiData, ITransactionAnalyzerApi } from '../../types/wax.js';
import { TransactionAnalyzerApiMock, type IMockData } from './api-mock.js';

export interface ITxInspectorGlobals {
  inspectorEngine: TxInspectorEngine;
}

export interface ITxAnalyzerGlobals {
  analyzer: TransactionAnalyzer;
  mockedApiProvider: TransactionAnalyzerApiMock;
}

export interface ITxInspectorMockGlobals {
  analyzer: TransactionAnalyzer;
}

declare global {
  function createTxInspectorTestFor(): Promise<ITxInspectorGlobals>;
  function createTxAnalyzerTestFor(mockDataFile: IMockData): Promise<ITxAnalyzerGlobals>;
  function createTxInspectorMockTestFor (mockData: any): Promise<ITxInspectorMockGlobals>;
  var customChainId: string | undefined;
  var customApiEndpoint: string | undefined;
  var mock: IMockData | undefined;
}

// Use function as we later extract the function name in the jest-helpers
globalThis.createTxInspectorTestFor = async function createTxInspectorTestFor () {
  const inspectorEngine = await TxInspectorEngine.create('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

  return { inspectorEngine };
};

globalThis.createTxAnalyzerTestFor = async function createTxAnalyzerTestFor (mockDataFile: IMockData): Promise<ITxAnalyzerGlobals> {
  const chain = await createHiveChain();
  const extendedChain = chain.extend<TChainExtendedApiData>();

  let apiProvider: ITransactionAnalyzerApi;
  const mockedApiProvider: TransactionAnalyzerApiMock = new TransactionAnalyzerApiMock();
  if (mockDataFile) {
    console.log(`Loading fixture-level mock data specified in file: ${mockDataFile}`);
    mockedApiProvider.load(mockDataFile);
    apiProvider = mockedApiProvider;
  } else {
    console.log('Missing mock data file at fixture level. Instantiated mocked API data provider will be supplied at each testcase level');
    apiProvider = new TransactionAnalyzerApiProvider(extendedChain);
  }

  const analyzer = new TransactionAnalyzer(extendedChain, apiProvider);

  return {
    analyzer,
    mockedApiProvider
  };
};

globalThis.createTxInspectorMockTestFor = async function createTxInspectorMockTestFor (mockData: any) {
  const chain = await createHiveChain();

  const extendedChain = chain.extend<TChainExtendedApiData>();
  const mock = new TransactionAnalyzerApiMock();
  if (mockData)
    mock.load(mockData);

  const analyzer = new TransactionAnalyzer(extendedChain, mock);

  return { analyzer };
};

export {};
