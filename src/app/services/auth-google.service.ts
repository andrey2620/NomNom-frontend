import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IGoogleLoginResponse, ILoginResponse, IUser } from '../interfaces';
import { authConfig } from '../pages/auth/login/auth-config'; // Commented out as the module does not exist
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGoogleService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,
    private authService : AuthService
  ) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public async getToken(): Promise<string | null> {
    await this.oauthService.tryLoginImplicitFlow();
    return this.oauthService.getIdToken();
  }

  public loginWithGoogle(email: string): Observable<IGoogleLoginResponse> {
    return this.http.post<IGoogleLoginResponse>('http://localhost:8080/auth/google-auth', { email }).pipe(
      tap((response: IGoogleLoginResponse) => {
        if (!response.accessToken) {
          console.error("No accessToken received from backend", response);
          return;
        }

        console.log("Google login successful, storing token:", response.accessToken);
        this.accessToken = response.accessToken;
        this.user = response.authUser;
        this.save();
        this.authService.setAuthData(response.authUser, response.accessToken, response.exists);
      })
    );
  }

  private save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
    if (this.accessToken) localStorage.setItem('access_token', this.accessToken);
    if (this.expiresIn) localStorage.setItem('expiresIn', this.expiresIn.toString());
  }

  public logout(): void {
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }
}
