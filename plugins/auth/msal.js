import { PublicClientApplication } from '@azure/msal-browser'

export default defineNuxtPlugin(async nuxtApp => {
  const auth = useRuntimeConfig().public

  if (!auth.clientID || !auth.tenantID) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ClientID or TenantID are missing'
    })
  }

  const msalConfig = {
    auth: {
      clientId: auth.clientID,
      authority: `https://login.microsoftonline.com/${auth.tenantID}`,
      redirectUri: `${auth.appBaseUrl}/Login`
      //postLogoutRedirectUri: `${import.meta.env.VITE_API_BASE_URL}/login`
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  }
  //useState("msalInstance", () => new PublicClientApplication(msalConfig));
  const msalInstance = new PublicClientApplication(msalConfig)
  await msalInstance.initialize()

  return {
    provide: {
      msalInstance: msalInstance
    }
  }
})
