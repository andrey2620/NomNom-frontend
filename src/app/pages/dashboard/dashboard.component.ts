import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  constructor(private router: Router, private authGoogleService: AuthService) {}

  profile = this.authGoogleService.profile();

  logOut() {
    this.authGoogleService.logout();
    this.router.navigate(["/login"]);
  }
}
