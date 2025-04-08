import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { switchMap } from 'rxjs';
import { ILoginResponse } from '../../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  showPassword = false;
  loginError!: string;
  loginForm = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin() {
    this.authService
      .login(this.loginForm)
      .pipe(switchMap((res: ILoginResponse) => this.authService.initializeUserSession(res.authUser, res.token, res.expiresIn)))
      .subscribe({
        next: () => {
          this.router.navigate(['/app/generateRecipes']);
        },
        error: () => {
          this.loginError = 'Credenciales inválidas. Intente de nuevo.';
        },
      });
  }
}
