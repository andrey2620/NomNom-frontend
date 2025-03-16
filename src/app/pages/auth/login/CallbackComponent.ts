import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { IUser } from '../../../interfaces';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CallbackComponent implements OnInit {
  private oauthService = inject(OAuthService);
  private authGoogleService = inject(AuthGoogleService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Small delay to ensure OAuth process is complete
    setTimeout(() => {
      this.handleAuthentication();
    }, 1000);
  }

  private handleAuthentication(): void {
    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          const idToken = this.oauthService.getIdToken();
          const userClaims = this.oauthService.getIdentityClaims();

          const userData: IUser = {
            picture: userClaims['picture'],
            name: userClaims['name'],
            email: userClaims['email'],
            authorities: [{ authority: 'USER' }],
          };
          console.log('User :', userData);

          // Temporarily skip backend authentication
          this.authService.setGoogleAuthData({
            email: userData.email!,
            accessToken: idToken,
            authUser: userData,
            expiresIn: 3600,
          });
          this.router.navigate(['/app/dashboard']);

          // Commented out backend call for now
          /*
          this.authGoogleService.loginWithGoogle(idToken).subscribe({
            next: (response: { token: string; user: { id: string; email: string; name: string; picture: string } }) => {
              console.log('Login response:', response);
              this.authService.setGoogleAuthData(response);
              this.router.navigate(['/app/dashboard']);
            },
            error: error => {
              console.error('Google authentication error:', error);
              this.router.navigate(['/login']);
            },
          });
          */
        } else {
          console.error('No valid access token found');
          this.router.navigate(['/login']);
        }
      })
      .catch(error => {
        console.error('OAuth process error:', error);
        this.router.navigate(['/login']);
      });
  }
}
