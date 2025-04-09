import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { ToastService } from '../../../services/toast.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  public loginError!: string;
  public showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private authGoogleService: AuthGoogleService,
    private toastService: ToastService,
    private oauthService: OAuthService
  ) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleLogin(): void {
    const { email, password } = this.loginForm;

    if (!email?.trim() || !password?.trim()) {
      this.toastService.showWarning('Por favor complete todos los campos.');
      if (!email?.trim()) this.emailModel.control.markAsTouched();
      if (!password?.trim()) this.passwordModel.control.markAsTouched();
      return;
    }

    this.authService
      .login(this.loginForm)
      .pipe(switchMap(res => this.authService.initializeUserSession(res.authUser, res.token, res.expiresIn)))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('¡Bienvenido de nuevo!');
          this.router.navigate(['/app/generateRecipes']);
        },
        error: () => {
          this.toastService.showError('Credenciales inválidas. Intente de nuevo.');
          this.loginError = 'Credenciales inválidas. Intente de nuevo.';
        },
      });
  }

  loginWithGoogle(): void {
    console.log('[LoginComponent] Redirigiendo al flujo de Google...');
    this.oauthService.initCodeFlow();
  }

}
