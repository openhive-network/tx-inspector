import type { IWaxOptions } from '@hiveio/wax';
import { TxInspectorEngine } from '../../utils/txInspector.js';

export interface ITxInspectorGlobals {
  txInspector: TxInspectorEngine;
}

declare global {
  function createTxInspectorTestFor (): Promise<ITxInspectorGlobals>;
  // eslint-disable-next-line no-var
  var customChainId: IWaxOptions | undefined;
}

// Use function as we later extract the function name in the jest-helpers
globalThis.createTxInspectorTestFor = async function createTxInspectorTestFor () {
  const txInspector = await (TxInspectorEngine).create('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

  if (customChainId)
    await txInspector.changeConfig(customChainId.chainId, 'https://api.hive.blog/');

  return { txInspector };
};

export {};
