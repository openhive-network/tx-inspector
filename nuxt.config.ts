/* eslint-disable @typescript-eslint/naming-convention */
import { execFileSync } from 'child_process';
import { defineNuxtConfig } from 'nuxt/config';

// `git rev-parse` rather than reading .git/HEAD: in a linked worktree .git is a file.
// Builds outside a usable git checkout (e.g. a source tarball) get a placeholder.
const getCommitHash = () => {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return 'unknown';
  }
};

export default defineNuxtConfig({
  // Nuxt 3's layout: the sources stay at the root, where the rollup test bundle
  // compiles utils/, types/ and lib/ too; app/ only holds spa-loading-template.html.
  // Explicit, because Nuxt 4 makes app/ the srcDir as soon as it holds any other file.
  srcDir: '.',
  dir: {
    app: 'app'
  },
  ssr: false,
  app: {
    head: {
      title: 'Transaction inspector'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'nuxt-vitalizer'
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

  postcss: {
    plugins: {
      // Not used by the styles, and Nuxt 4 resolves PostCSS plugins from the root, where pnpm
      // does not hoist the tailwindcss that @nuxtjs/tailwindcss brings
      'tailwindcss/nesting': false
    }
  },

  css: [
    // First: it declares the cascade layer order Vuetify's styles are ranked in
    '~/assets/css/tailwind.css',
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],

  build: {
    transpile: ['vuetify', 'shadcn']
  },

  plugins: [
    '~/plugins/vuetify.ts',
    '~/plugins/txInspector.ts',
    '~/plugins/formatter.ts',
    '~/plugins/binaryView.ts',
    '~/plugins/buffer.ts'
  ],

  components: {
    dirs: [
      '~/components'
    ]
  },

  vite: {
    // Vite's oxc transform takes experimentalDecorators (plugins/formatter.ts) from tsconfig.json
    define: {
      COMMIT_HASH: `'${getCommitHash()}'`
    }
  },

  typescript: {
    tsConfig: {
      // The submodule's shared TS sources are not part of the app
      exclude: ['../common-ci-configuration']
    }
  },

  vitalizer: {
    disablePrefetchLinks: true
  },

  compatibilityDate: '2024-10-08',

  runtimeConfig: {
    public: {
      blockExplorerUrl: process.env.NUXT_PUBLIC_BLOCK_EXPLORER_URL ? '' : 'https://explore.openhive.network',
      defaultChainId: process.env.NUXT_PUBLIC_DEFAULT_CHAIN_ID ? '' : 'beeab0de00000000000000000000000000000000000000000000000000000000',
      defaultEndpointUrl: process.env.NUXT_PUBLIC_DEFAULT_ENDPOINT_URL ? '' : 'https://api.hive.blog/'
    }
  }
});
