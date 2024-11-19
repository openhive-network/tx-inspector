export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  const txInspector = TxInspectorEngine.create(config.public.defaultChainId, config.public.defaultEndpointUrl);

  return {
    provide: {
      txInspector: await txInspector,
      chain: (await txInspector).extendedChain
    }
  };
});
