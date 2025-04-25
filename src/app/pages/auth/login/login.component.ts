import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthGoogleService } from '../../../services/auth-google.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { ToastService } from '../../../services/toast.service';

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
    private toastService: ToastService
  ) {}

  /** Login normal */
  handleLogin() {
    const { email, password } = this.loginForm;

    if (!email?.trim() || !password?.trim()) {
      this.toastService.showWarning('Por favor complete todos los campos.');

      // Marca visual para los campos tocados si están vacíos
      if (!email?.trim()) this.emailModel.control.markAsTouched();
      if (!password?.trim()) this.passwordModel.control.markAsTouched();

      return;
    }

    this.authService
      .login(this.loginForm)
      .pipe(
        tap(res => {
          this.authService.initializeUserSession(res.authUser, res.token, res.expiresIn);
        })
      )
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

  /** Login con Google */
  public signInWithGoogle(): void {
    this.authGoogleService.startGoogleFlow();
  }
}
