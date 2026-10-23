import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// MSAL se inicializa una sola vez dentro de appConfig (APP_INITIALIZER)
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
