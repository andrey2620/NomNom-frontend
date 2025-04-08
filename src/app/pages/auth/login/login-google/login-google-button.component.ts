import { Component } from '@angular/core';
import { AuthGoogleService } from '../../../../services/auth-google.service';

@Component({
  selector: 'app-login-google-button',
  standalone: true,
  templateUrl: './login-google-button.component.html',
})
export class LoginGoogleButtonComponent {
  constructor(private authGoogleService: AuthGoogleService) {}

  signInWithGoogle(): void {
    this.authGoogleService.signInWithGoogle(); // delegamos al servicio
  }
}
