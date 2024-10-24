import BinaryView from '@hiveio/component-binary-view';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(BinaryView);
});
