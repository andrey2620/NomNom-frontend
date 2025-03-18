import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

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
    private oauthService: OAuthService
  ) {}

  /**  Método para Login Normal (Email y Password) */
  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid || !this.passwordModel.valid) {
      this.emailModel.control.markAsTouched();
      this.passwordModel.control.markAsTouched();
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (err: any) => {
        console.error('Error en login normal:', err);
        this.loginError = err.error?.description || 'Error en login.';
      },
    });
  }

  /** Método para Login con Google */
  public signInWithGoogle(): void {
    this.oauthService.initLoginFlow(); // Esto redirige a la página de login de Google
  }
}
