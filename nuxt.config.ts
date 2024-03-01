// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-primevue'],
  primevue: {
    /* Options */
    components: {
      include: '*',
      exclude: ['Galleria', 'Carousel']
    },
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
  },
  css: [
    'primevue/resources/themes/aura-light-green/theme.css',
    '~/assets/css/main.css',
    'primeicons/primeicons.css'
  ],
  runtimeConfig: {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_VERSION: process.env.AZURE_OPENAI_VERSION,
    AZURE_OPENAI_INSTANCE: process.env.AZURE_OPENAI_ENDPOINT_FOR_IDIOTS

    // can be overridden by NUXT_API_SECRET environment variable
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
