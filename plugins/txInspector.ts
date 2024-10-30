const txInspector = TxInspectorEngine.create('beeab0de00000000000000000000000000000000000000000000000000000000', 'https://api.hive.blog/');

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      txInspector: await txInspector,
      chain: (await txInspector).extendedChain
    }
  };
});
