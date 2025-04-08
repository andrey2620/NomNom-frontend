import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpComponent implements OnInit {
  public signUpError!: string;
  public validSignup!: boolean;
  public showPassword = false;

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  public user: IUser = {
    email: '',
    name: '',
    lastname: '',
    password: '',
  };
  public isGoogleSignUp = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.user.email = params['email'];
        this.isGoogleSignUp = true;
      }
      if (params['name']) {
        this.user.name = params['name'];
      }
      if (params['lastname']) {
        this.user.lastname = params['lastname'];
      }
    });
  }

  public handleSignup(event: Event) {
    event.preventDefault();

    const camposFaltantes: string[] = [];

    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
      camposFaltantes.push('Nombre');
    }

    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
      camposFaltantes.push('Apellido');
    }

    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
      camposFaltantes.push('Correo electrónico');
    }

    if (!this.isGoogleSignUp && !this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
      camposFaltantes.push('Contraseña');
    }

    if (camposFaltantes.length > 0) {
      this.toastService.showWarning(`Por favor complete los siguientes campos: ${camposFaltantes.join(', ')}`);
      return;
    }

    this.authService.signup(this.user).subscribe({
      next: () => {
        this.validSignup = true;
        this.toastService.showSuccess('Registro exitoso. Inicia sesión para continuar.');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Error al registrar:', err);

        let mensaje = 'Error en el registro.';

        if (typeof err.error === 'string') {
          mensaje = err.error;
        } else if (err.error?.message) {
          mensaje = err.error.message;
        } else if (err.message) {
          mensaje = err.message;
        }

        this.signUpError = mensaje;
        this.toastService.showError(mensaje);

        if (mensaje.toLowerCase().includes('email')) {
          this.emailModel.control.setErrors({ emailEnUso: true });
        }
      },
    });
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
