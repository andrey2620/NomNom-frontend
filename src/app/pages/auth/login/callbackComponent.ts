import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('[CallbackComponent] ngOnInit ejecutado');

    try {
      console.log('[CallbackComponent] Iniciando carga del documento de descubrimiento...');
      await this.oauthService.loadDiscoveryDocument();

      console.log('[CallbackComponent] Ejecutando tryLoginCodeFlow...');
      const result = await this.oauthService.tryLoginCodeFlow();

      if (this.oauthService.hasValidAccessToken()) {
        const claims: any = this.oauthService.getIdentityClaims();
        if (!claims) throw new Error('No se pudieron obtener los claims');

        const email = claims.email;
        const name = claims.given_name;
        const lastname = claims.family_name;

        const user = {
          email,
          name,
          lastname,
          authorities: [],
          picture: claims.picture,
        };

        const token = this.oauthService.getAccessToken() || this.oauthService.getIdToken();

        await this.authService.initializeUserSession(user, token);
        this.router.navigate(['/app/generateRecipes']);
      } else {
        console.warn('[CallbackComponent] Token no válido o inexistente');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('[CallbackComponent] Error en tryLoginCodeFlow:', error);
      this.router.navigate(['/login']);
    }
  }

}
