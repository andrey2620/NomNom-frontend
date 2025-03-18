import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthGoogleService } from '../../../services/auth-google.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private authGoogleService: AuthGoogleService,
    private oauthService: OAuthService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.handleGoogleAuthentication();
    }, 1000);
  }

/*   private handleGoogleAuthentication(): void {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const identityClaims = this.oauthService.getIdentityClaims();
        const userEmail = identityClaims?.['email'] || null;

        console.log("Google User Email:", userEmail);

        if (!userEmail) {
          console.error("No se encontró un email válido de Google.");
          return;
        }

        this.authGoogleService.loginWithGoogle(userEmail).subscribe({
          next: (response) => {
            console.log("Respuesta del backend:", response);

            if (response.accessToken) {
              localStorage.setItem("access_token", response.accessToken);
              this.router.navigate(['/app/dashboard']);
            } else {
              console.error("No se recibió un access token válido.");
              this.router.navigate(['/login']);
            }
          },
          error: () => {
            console.error("Error en Google login, redirigiendo a /login");
            this.router.navigate(['/login']);
          },
        });
      } else {
        console.error("No se encontró un token válido de Google");
        this.router.navigate(['/login']);
      }
    }).catch(err => {
      console.error("Error en Google OAuth:", err);
      this.router.navigate(['/login']);
    });
  } */

    private handleGoogleAuthentication(): void {
      this.oauthService.loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          if (!this.oauthService.hasValidAccessToken()) {
            console.error("No se encontró un token válido de Google");
            this.router.navigate(['/login']);
            return;
          }

          const identityClaims = this.oauthService.getIdentityClaims();
          const userEmail = identityClaims?.['email'] || null;

          console.log("Google User Email:", userEmail);

          if (!userEmail) {
            console.error("No se encontró un email válido de Google.");
            this.router.navigate(['/login']);
            return;
          }

          this.authGoogleService.loginWithGoogle(userEmail).subscribe({
            next: (response) => this.handleLoginResponse(response, userEmail),
            error: () => this.handleLoginError(),
          });
        })
        .catch(err => {
          console.error("Error en Google OAuth:", err);
          this.router.navigate(['/login']);
        });
    }

    /** 🔹 Manejar la respuesta del backend */
    private handleLoginResponse(response: any, userEmail: string): void {
      console.log("Respuesta del backend:", response);

      if (!response.exists) {
        console.warn("Usuario no encontrado, redirigiendo a registro...");
        this.router.navigate(['/signup'], { queryParams: { email: userEmail } });
        return;
      }

      localStorage.setItem("access_token", response.accessToken);
      this.router.navigate(['/app/dashboard']);
    }

    /** 🔹 Manejar errores en el login */
    private handleLoginError(): void {
      console.error("Error en Google login, redirigiendo a /login");
      this.router.navigate(['/login']);
    }
}