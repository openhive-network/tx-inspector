/* eslint-disable no-var */
import { createHiveChain } from '@hiveio/wax';
import { TransactionAnalyzer, TxInspectorEngine } from '../../utils/txInspector.js';
import type { TChainExtendedApiData } from '../../types/wax.js';
import { TransactionAnalyzerApiMock } from './api-mock.js';

export interface ITxInspectorGlobals {
  inspectorEngine: TxInspectorEngine;
}

export interface ITxInspectorMockGlobals {
  analyzer: TransactionAnalyzer;
}

declare global {
  function createTxInspectorTestFor (): Promise<ITxInspectorGlobals>;
  function createTxInspectorMockTestFor (mockData: any): Promise<ITxInspectorMockGlobals>;
  var customChainId: string | undefined;
  var customApiEndpoint: string | undefined;
}

// Use function as we later extract the function name in the jest-helpers
globalThis.createTxInspectorTestFor = async function createTxInspectorTestFor () {
  const inspectorEngine = await TxInspectorEngine.create('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

  return { inspectorEngine };
};

globalThis.createTxInspectorMockTestFor = async function createTxInspectorMockTestFor (mockData: any) {
  const chain = await createHiveChain();

  const extendedChain = chain.extend<TChainExtendedApiData>();

  const analyzer = new TransactionAnalyzer(extendedChain, new TransactionAnalyzerApiMock(mockData));

  return { analyzer };
};

export {};
