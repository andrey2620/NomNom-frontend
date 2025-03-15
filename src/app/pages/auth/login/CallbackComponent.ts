import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-callback',
  template: '<p>Procesando login...</p>',
})
export class CallbackComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) { }

  ngOnInit(): void {
    // Carga el documento de descubrimiento y procesa el callback
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        // Login exitoso, redirige al dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Si no se obtuvo un token válido, redirige al login
        this.router.navigate(['/login']);
      }
    });
  }
}
