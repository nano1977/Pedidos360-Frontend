import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'TU_CLIENT_ID_DE_AZURE', // Reemplaza con tu Client ID
    authority: 'https://login.microsoftonline.com/TU_TENANT_ID_DE_AZURE', // Reemplaza con tu Tenant ID
    redirectUri: 'http://localhost:4200'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
  }
});