import { WaxAccountInformation } from '~/utils/waxAccountInformation';

const wax = new WaxAccountInformation();

export default defineNuxtPlugin(async () => {
  return {
    provide: {
      wax,
      chain: await wax.getChain()
    }
  };
});
