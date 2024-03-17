// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  plugins: [{ src: '~/plugins/auth/msal', mode: 'client' }],
  modules: ['@nuxt/ui', '@nuxt/image'],
  colorMode: {
    preference: 'light'
  },
  ui: {
    primary: 'green',
    gray: 'cool',
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-0 bottom-auto'
    }
  },

  runtimeConfig: {
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_VERSION: process.env.AZURE_OPENAI_VERSION,
    AZURE_OPENAI_INSTANCE: process.env.AZURE_OPENAI_ENDPOINT_FOR_IDIOTS,
    database: process.env.SET_DATABASE,
    ELASTIC_CLOUD_ID: process.env.ELASTIC_CLOUD_ID,
    ELASTIC_USERNAME: process.env.ELASTIC_USERNAME,
    ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD,
    public: {
      clientID: process.env.AUTH_CLIENT_ID,
      tenantID: process.env.AUTH_TENANT_ID,
      appBaseUrl: process.env.AUTH_BASE_URL
    }

    // can be overridden by NUXT_API_SECRET environment variable
  }
})
