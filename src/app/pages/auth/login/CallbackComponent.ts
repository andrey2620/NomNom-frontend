import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../../services/auth-google.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {
  constructor(private authGoogleService: AuthGoogleService) {}

  ngOnInit(): void {
    this.authGoogleService.signInWithGoogle();
  }
}
