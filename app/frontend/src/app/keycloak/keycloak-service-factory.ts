import { KeycloakService } from 'keycloak-angular';

export function keycloakServiceFactory(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://192.168.15.23:8081',
        realm: 'master',
        clientId: 'simple-node-client',
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets'],
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
