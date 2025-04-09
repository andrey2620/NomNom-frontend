import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './pages/auth/login/auth-config';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private oauthService: OAuthService) {
    this.configureSSO();
  }

  private configureSSO(): void {
    console.log('[AppComponent] Iniciando carga del documento de descubrimiento...');
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocument().then(() => {
      console.log('[AppComponent] Documento de descubrimiento cargado correctamente');
    });
  }
}
