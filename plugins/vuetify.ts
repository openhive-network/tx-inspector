import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md3 } from 'vuetify/blueprints';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    blueprint: md3,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            background: '#1a1e22',
            foreground: '#fafafa'
          }
        }
      }
    }
  });
  nuxtApp.vueApp.use(vuetify);
});
