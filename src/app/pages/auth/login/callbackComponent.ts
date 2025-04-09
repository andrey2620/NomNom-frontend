import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private authGoogleService: AuthGoogleService,
    private oauthService: OAuthService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.handleGoogleAuthentication();
    }, 1000);
  }

  private handleGoogleAuthentication(): void {
    this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.oauthService.tryLoginCodeFlow())
      .then(() => {
        if (!this.oauthService.hasValidAccessToken()) {
          this.toastService.showError('No se encontró un token válido de Google');
          this.router.navigate(['/login']);
          return;
        }

        const identityClaims: any = this.oauthService.getIdentityClaims();
        const userEmail = identityClaims?.['email'] || null;
        const userName = identityClaims?.['given_name'] || '';
        const userLastname = identityClaims?.['family_name'] || '';

        if (!userEmail) {
          this.toastService.showError('No se encontró un email válido de Google.');
          this.router.navigate(['/login']);
          return;
        }

        this.authGoogleService.signInWithGoogle(userEmail).subscribe({
          next: response => this.handleLoginResponse(response, userEmail, userName, userLastname),
          error: () => this.handleLoginError(),
        });
      })
      .catch(err => {
        this.toastService.showError('Error inesperado en el inicio de sesión con Google');
        console.error('Error en Google OAuth:', err);
        this.router.navigate(['/login']);
      });
  }

  private handleLoginResponse(response: any, userEmail: string, userName: string, userLastname: string): void {
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

    this.authService.initializeUserSession(response.authUser, response.accessToken).subscribe({
      next: () => {
        this.toastService.showSuccess(`¡Bienvenido, ${response.authUser.name || 'usuario'}!`);
        this.router.navigate(['/app/generateRecipes']);
      },
      error: () => this.handleLoginError(),
    });
  }

  private handleLoginError(): void {
    this.toastService.showError('Error al iniciar sesión con Google. Intenta de nuevo.');
    this.router.navigate(['/login']);
  }
}
