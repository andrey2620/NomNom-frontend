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
  userEmail!: string | null; // 🔹 Variable para almacenar el email

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

  private handleGoogleAuthentication(): void {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const identityClaims = this.oauthService.getIdentityClaims(); // 🔹 Obtener datos del usuario
        this.userEmail = identityClaims?.['email'] || null;

        console.log("Google User Email:", this.userEmail); // 🔹 Imprimir el email en consola

        if (!this.userEmail) {
          console.error("No se encontró un email válido de Google.");
          return;
        }

        // 🔹 Enviar solo el correo al backend
        this.authGoogleService.loginWithGoogle(this.userEmail).subscribe({
          next: () => this.router.navigate(['/app/dashboard']),
          error: () => this.router.navigate(['/login']),
        });
      } else {
        console.error('No valid access token found');
        this.router.navigate(['/login']);
      }
    });
  }
}
