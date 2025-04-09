import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../app/pages/auth/login/auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
  }

  public startGoogleFlow(): void {
    console.log('[AuthGoogleService] Iniciando login de Google con PKCE...');
    this.oauthService.loadDiscoveryDocumentAndLogin().then(loggedIn => {
      if (!loggedIn) {
        this.oauthService.initCodeFlow();
      }
    });
  }
}
