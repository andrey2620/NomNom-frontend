import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-account.component.html',
})
export class MyAccountComponent implements OnInit {
  public userName: string = '';

  constructor(
    public router: Router,
    private service: AuthService
  ) {
    let user = localStorage.getItem('auth_user');
    if (user) {
      this.userName = JSON.parse(user)?.name;
    }
  }

  ngOnInit() {}

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
