import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  //@ViewChild('confPassword') confPasswordModel!: NgModel;

  public user: IUser = {};

  confPasswordValue = '';

  // Variables para mostrar/ocultar contraseña
  showPassword = false;
  showConfirmPassword = false;

  // Método para alternar la visibilidad de la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Método para alternar la visibilidad de la confirmación de contraseña
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  constructor(private router: Router, 
    private authService: AuthService
  ) {}

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    /*if (!this.confPasswordModel.valid) {
      this.confPasswordModel.control.markAsTouched();
    }*/
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.signup(this.user).subscribe({
        next: () => this.validSignup = true,
        error: (err: any) => (this.signUpError = err.description),
      });
    }
  }
}
