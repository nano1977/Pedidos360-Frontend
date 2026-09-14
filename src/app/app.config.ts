import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MSAL_INSTANCE, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

export function MSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: 'c926387b-811c-4ffb-a71a-53ff3beaedac',
      authority: 'https://login.microsoftonline.com/bb5324af-c266-41ed-b36c-a971641c7af2',
      redirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    MsalBroadcastService
  ]
};