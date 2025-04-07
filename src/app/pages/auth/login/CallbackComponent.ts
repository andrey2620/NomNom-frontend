import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { ToastService } from '../../../services/toast.service';
import { IngredientService } from '../../../services/ingredient.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private authGoogleService: AuthGoogleService,
    private authService: AuthService,
    private oauthService: OAuthService,
    private toastService: ToastService,
    private ingredientService: IngredientService
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.handleGoogleAuthentication(), 1000);
  }

  private handleGoogleAuthentication(): void {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (!this.oauthService.hasValidAccessToken()) {
        this.toastService.showError('No se encontró un token válido de Google.');
        this.router.navigate(['/login']);
        return;
      }

      const identityClaims = this.oauthService.getIdentityClaims();
      const userEmail = identityClaims?.['email'];

      if (!userEmail) {
        this.toastService.showError('No se encontró un correo válido de Google.');
        this.router.navigate(['/login']);
        return;
      }

      this.authGoogleService.loginWithGoogle(userEmail).subscribe({
        next: (response) => this.handleLoginResponse(response),
        error: () => this.handleLoginError()
      });
    }).catch(err => {
      console.error('Error en Google OAuth:', err);
      this.toastService.showError('Error durante la autenticación con Google.');
      this.router.navigate(['/login']);
    });
  }

  private handleLoginResponse(response: { exists: boolean; accessToken: string }): void {
    localStorage.setItem('access_token', response.accessToken);

    if (!response.exists) {
      this.toastService.showInfo('Primera vez en NomNom?. Por favor completá tu registro.');
      this.router.navigate(['/signup']);
      return;
    }

    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.ingredientService.getFormattedIngredientsByUser(userId).subscribe({
        next: (res) => {
          if (res?.data) {
            localStorage.setItem('user_ingredients', JSON.stringify(res.data));
          }
          this.toastService.showSuccess('Sesión iniciada con Google.');
          this.router.navigate(['/app/generateRecipes']);
        },
        error: () => {
          this.toastService.showWarning('No se pudieron cargar los ingredientes del usuario.');
          this.router.navigate(['/app/generateRecipes']);
        }
      });
    } else {
      this.toastService.showError('No se pudo identificar al usuario.');
      this.router.navigate(['/login']);
    }
  }

  private handleLoginError(): void {
    this.toastService.showError('No se pudo iniciar sesión con Google. Intentalo de nuevo.');
    this.router.navigate(['/login']);
  }
}
