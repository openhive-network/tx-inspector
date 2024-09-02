/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs';
import { defineNuxtConfig } from 'nuxt/config';

const getCommitHash = () => {
  const rev = fs.readFileSync('.git/HEAD').toString().trim();

  if (!rev.includes(':'))
    return rev;
  else
    return fs.readFileSync(`.git/${rev.substring(5)}`).toString().trim();
};

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Transaction inspector'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt'
  ],

  shadcn: {
    /**
     * Prefix for all the imported components
     */
    prefix: 's',
    /**
     * Directory that the components live in.
     */
    componentDir: './components/shadcn/'
  },

  pinia: {
    storesDirs: ['./stores/**']
  },

  css: [
    '~/assets/css/tailwind.css',
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],

  build: {
    transpile: ['vuetify', 'shadcn']
  },

  plugins: [
    '~/plugins/vuetify.ts',
    '~/plugins/wax.ts',
    '~/plugins/formatter.ts'
  ],

  components: {
    dirs: [
      '~/components'
    ]
  },

  vite: {
    define: {
      COMMIT_HASH: `'${getCommitHash()}'`
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true
        }
      }
    }
  }
});
