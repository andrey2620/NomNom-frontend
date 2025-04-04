import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  public resetForm = { password: '', confirmPassword: '' };
  private token = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.router.navigate(['/access-denied']);
    }
  }

  handleResetPassword(event: Event) {
    event.preventDefault();

    const { password, confirmPassword } = this.resetForm;

    if (!password || !confirmPassword) {
      this.toastService.showError('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      this.toastService.showError('Las contraseñas no coinciden.');
      return;
    }

    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.toastService.showSuccess('Cambio de contraseña exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: error => {
        this.toastService.showError(error.error?.message + '. Redirigiendo al login...' || 'Error cambiando contraseña.');
        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 3000);
      },
    });
  }
  navigateToLogin() {
    this.token = '';
    this.router.navigateByUrl('login');
  }
}
