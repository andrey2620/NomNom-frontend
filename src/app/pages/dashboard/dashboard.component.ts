import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthGoogleService } from "../../services/auth-google.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  private authService = inject(AuthGoogleService);
  private router = inject(Router);

  profile = this.authService.profile;

  logOut() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
