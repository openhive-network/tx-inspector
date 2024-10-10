/* eslint-disable no-var */
import { TxInspectorEngine } from '../../utils/txInspector.js';

export interface ITxInspectorGlobals {
  txInspector: TxInspectorEngine;
}

declare global {
  function createTxInspectorTestFor (): Promise<ITxInspectorGlobals>;
  var customChainId: string | undefined;
  var customApiEndpoint: string | undefined;
}

// Use function as we later extract the function name in the jest-helpers
globalThis.createTxInspectorTestFor = async function createTxInspectorTestFor () {
  const txInspector = await (TxInspectorEngine).create('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

  return { txInspector };
};

export {};
