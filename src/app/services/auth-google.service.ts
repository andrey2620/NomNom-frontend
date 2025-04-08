import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(private oauthService: OAuthService) {}

  public signInWithGoogle(): void {
    console.log('[AuthGoogleService] Iniciando login de Google...');
    this.oauthService.initLoginFlow(); // esta línea inicia el flujo
  }
}
