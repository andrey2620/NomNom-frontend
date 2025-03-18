import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public user: IUser | undefined;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
