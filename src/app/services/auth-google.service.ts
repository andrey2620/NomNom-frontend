import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { IGoogleLoginResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  constructor(
    private oauthService: OAuthService,
    private http: HttpClient
  ) {}

  /** Inicia el flujo OAuth con Google */
  public startGoogleFlow(): void {
    console.log('[AuthGoogleService] Iniciando login de Google...');
    this.oauthService.initLoginFlow();
  }

  /** Llama a backend con el email extraído de Google */
  public signInWithGoogle(email: string): Observable<IGoogleLoginResponse> {
    return this.http.post<IGoogleLoginResponse>('auth/google-auth', { email });
  }
}
