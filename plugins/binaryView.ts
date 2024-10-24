import '@hiveio/component-binary-view/styles';
// eslint-disable-next-line import/no-named-as-default
import BinaryView from '@hiveio/component-binary-view';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(BinaryView);
});
