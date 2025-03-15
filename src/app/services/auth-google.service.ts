import { Injectable, inject, signal } from '@angular/core';

import { Router } from '@angular/router';

import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { authConfig } from '../pages/auth/login/auth-config';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {

  private oAuthService = inject(OAuthService);

  private router = inject(Router);

  profile = signal<any>(null);
  private http = inject(HttpClient);

  constructor() {
    this.initConfiguration();
  }

  initConfiguration() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oAuthService.hasValidIdToken()) {
        this.profile.set(this.oAuthService.getIdentityClaims());
      }
    });
  }

  // Envía el token de Google a tu backend para que éste genere un JWT
  loginWithGoogle(googleToken: string): Observable<string> {
    return this.http.post<string>('/api/auth/google', { token: googleToken });
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
    this.profile.set(null);
  }

  getProfile() {
    return this.profile();
  }
}