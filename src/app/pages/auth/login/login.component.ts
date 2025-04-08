import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { IngredientService } from '../../../services/ingredient.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginError!: string;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = { email: '', password: '' };

  showPassword = false;
  showConfirmPassword = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private authGoogleService: AuthGoogleService,
    private oauthService: OAuthService,
    private ingredientService: IngredientService
  ) {}

  /** Login normal */
  handleLogin() {
    this.authService.login(this.loginForm).pipe(
      switchMap(res => this.authService.initializeUserSession(res.authUser, res.token, res.expiresIn))
    ).subscribe({
      next: () => {
        this.router.navigate(['/app/generateRecipes']);
      },
      error: () => {
        this.loginError = 'Credenciales inválidas. Intente de nuevo.';
      },
    });
  }

  /** Login con Google */
  public signInWithGoogle(): void {
    this.authGoogleService.startGoogleFlow();
  }
}
