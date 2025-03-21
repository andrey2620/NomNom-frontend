import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-forgotPassword',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgotPassword.component.html',
  styleUrl: './forgotPassword.component.scss'
})
export class ForgotPasswordComponent {

  forgotSuccessMessage: string | null = null;
  forgotError: string | null = null;

  @ViewChild('email') emailModel!: NgModel;

  public forgotForm : { email: string } = {
    email: ''
  };

  constructor(
    private router: Router, 
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  handleForgotPassword(event: Event) {
    event.preventDefault();

    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
      return;
    }
    if(this.emailModel.valid){
      this.authService.sendResetLink(this.forgotForm.email).subscribe({
        next: (response) => {
          this.toastService.showSuccess(response.message + ' Verfique su correo electrónico para continuar.');
          this.router.navigateByUrl('login');
        },
        error: (response) => {
          this.toastService.showError(response.error.message ?? 'Error desconocido');
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('login');
  }
}
