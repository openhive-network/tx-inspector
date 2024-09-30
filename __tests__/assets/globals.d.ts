// We only want to import types here!!
import type { IWaxOptions } from '@hiveio/wax';
import type { WaxAccountInformation } from '../../utils/waxAccountInformation';

export interface ITxInspectorGlobals {
  wax: WaxAccountInformation;
}

declare global {
  function createTxInspectorTestFor (): Promise<ITxInspectorGlobals>;
  var customChainId: IWaxOptions | undefined;
}
