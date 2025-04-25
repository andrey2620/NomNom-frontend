import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

interface GoogleIdentityClaims {
  email?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}

interface AuthResponse {
  exists: boolean;
  authUser?: any;
  accessToken?: string;
}

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CallbackComponent implements OnInit {
  loading = false;

  constructor(
    private router: Router,
    private authGoogleService: AuthGoogleService,
    private oauthService: OAuthService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.handleGoogleAuthentication();
  }

  private handleGoogleAuthentication(): void {
    this.loading = true;

    this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLoginCodeFlow())
      .then(() => {
        if (!this.oauthService.hasValidAccessToken()) {
          this.toastService.showError('No se encontró un token válido de Google');
          this.router.navigate(['/login']);
          return;
        }

        const identityClaims = this.oauthService.getIdentityClaims() as GoogleIdentityClaims;
        const userEmail = identityClaims?.email || null;
        const userName = identityClaims?.given_name || '';
        const userLastname = identityClaims?.family_name || '';

        if (!userEmail) {
          this.toastService.showError('No se encontró un email válido de Google.');
          this.router.navigate(['/login']);
          return;
        }

        this.authGoogleService.signInWithGoogle(userEmail).subscribe({
          next: (response: AuthResponse) => this.handleLoginResponse(response, userEmail, userName, userLastname),
          error: (error: any) => this.handleLoginError(error),
          complete: () => (this.loading = false),
        });
      })
      .catch(err => {
        this.loading = false;
        this.toastService.showError('Error inesperado en el inicio de sesión con Google');
        console.error('Error en Google OAuth:', err);
        this.router.navigate(['/login']);
      });
  }

  private handleLoginResponse(response: AuthResponse, userEmail: string, userName: string, userLastname: string): void {
    this.loading = false;

    if (!response.exists) {
      const mensaje = 'Bienvenido a NomNom.<br>Te redirigimos para completar tu registro.';
      this.toastService.showInfo(mensaje, 'Registro', {
        enableHtml: true,
      });
      this.router.navigate(['/signup'], {
        queryParams: { email: userEmail, name: userName, lastname: userLastname },
      });
      return;
    }

    this.authService.initializeUserSession(response.authUser, response.accessToken || '');
    this.router.navigate(['/app/generateRecipes']);
    this.toastService.showSuccess('¡Bienvenido de nuevo!');
  }

  private handleLoginError(error?: any): void {
    this.loading = false;
    console.error('Error during Google authentication:', error);
    this.toastService.showError('Error al iniciar sesión con Google. Intenta de nuevo.');
    this.router.navigate(['/login']);
  }
}
