import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
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
    '~/plugins/vuetify.ts'
  ],

  components: {
    dirs: [
      '~/components'
    ]
  }
});
