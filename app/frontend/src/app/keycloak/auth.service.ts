import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly keycloak: KeycloakService) {}

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  logout(): void {
    this.keycloak.logout();
  }

  getUserProfile(): any {
    return this.keycloak.loadUserProfile();
  }

}
