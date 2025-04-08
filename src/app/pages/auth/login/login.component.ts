import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginGoogleButtonComponent } from './login-google/login-google-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginFormComponent, LoginGoogleButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {}
