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
  public showPassword = false; // Estado inicial para mostrar/ocultar contraseña

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  //@ViewChild('confPassword') confPasswordModel!: NgModel;

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

  handleSignup(): void {
    const password = this.user.password;
    const name = this.user.name;
    const email = this.user.email;

    if (!email) {
      this.toastService.showWarning('Se necesita ingresar un correo.');
      return;
    }
    if (!name) {
      this.toastService.showWarning('Debe de asignar una nombre.');
      return;
    }
    if (!password || password.length < 8) {
      this.toastService.showWarning('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.authService.signup(this.user).subscribe({
      next: () => {
        this.toastService.showSuccess('Usuario registrado correctamente. Iniciá sesión.');
        this.validSignup = true;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastService.showWarning('Correo ya se encuentra en uso.');
      },
    });
  }

  // Método para alternar visibilidad de la contraseña
  public togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
