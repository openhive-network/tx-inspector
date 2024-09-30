import { WaxAccountInformation } from '../../dist/bundle/waxAccountInformation.js';

// Use function as we later extract the function name in the jest-helpers
globalThis.createTxInspectorTestFor = async function createTxInspectorTestFor () {
  const wax = new WaxAccountInformation();

  if (customChainId)
    await wax.changeChainId(customChainId.chainId);

  return { wax };
};

export {};
