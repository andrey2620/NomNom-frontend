import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';

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
  public showPassword: boolean = false; // Estado inicial para mostrar/ocultar contraseña

  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  //@ViewChild('confPassword') confPasswordModel!: NgModel;

  public user: IUser = { email: '', name: '', lastname: '', password: '' };
  public isGoogleSignUp = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
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

    if (!this.nameModel.valid || !this.lastnameModel.valid || (!this.passwordModel.valid && !this.isGoogleSignUp)) {
      this.nameModel.control.markAsTouched();
      this.lastnameModel.control.markAsTouched();
      if (!this.isGoogleSignUp) {
        this.passwordModel.control.markAsTouched();
      }
      return;
    }

    this.authService.signup(this.user).subscribe({
      next: () => {
        this.validSignup = true;
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.signUpError = err.description || 'Error en el registro.';
      },
    });
  }

  // Método para alternar visibilidad de la contraseña
  public togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
