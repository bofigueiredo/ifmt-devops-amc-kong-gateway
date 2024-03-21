import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { keycloakServiceFactory } from './keycloak/keycloak-service-factory';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakServiceFactory,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
    provideHttpClient(
      withInterceptorsFromDi() 
    ), provideAnimationsAsync()
  ]
};