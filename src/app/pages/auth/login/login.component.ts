import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { IngredientService } from '../../../services/ingredient.service';

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

  // Variables para mostrar/ocultar contraseña
  showPassword = false;
  showConfirmPassword = false;

  // Método para alternar la visibilidad de la contraseña
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

  /**  Método para Login Normal (Email y Password) */
  handleLogin() {
    this.authService.loginAndInitialize(this.loginForm).subscribe({
      next: () => {
        this.router.navigate(['/app/generateRecipes']);
      },
      error: () => {
        this.loginError = 'Credenciales inválidas. Intente de nuevo.';
      },
    });
  }

  /** Método para Login con Google */
  public signInWithGoogle(): void {
    this.oauthService.initLoginFlow(); // Esto redirige a la página de login de Google
  }
}
