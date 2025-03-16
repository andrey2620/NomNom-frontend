import { CommonModule } from "@angular/common"
import { Component, OnInit, inject } from "@angular/core"
import { Router } from "@angular/router"
import { OAuthService } from "angular-oauth2-oidc"
import { AuthGoogleService } from "../../../services/auth-google.service"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-callback",
  templateUrl: "./callback.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class CallbackComponent implements OnInit {
  private oauthService = inject(OAuthService)
  private authGoogleService = inject(AuthGoogleService)
  private authService = inject(AuthService)
  private router = inject(Router)

  ngOnInit(): void {
    // Small delay to ensure OAuth process is complete
    setTimeout(() => {
      this.handleAuthentication()
    }, 1000)
  }

  private handleAuthentication(): void {
    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          const idToken = this.oauthService.getIdToken()
          console.log("token:", idToken) // For debugging
          const userClaims = this.oauthService.getIdentityClaims()
          console.log("User claims:", userClaims) // For debugging

          this.authGoogleService.loginWithGoogle(idToken).subscribe({
            next: (response: any) => {
              console.log("Login response:", response) // For debugging
              this.authService.setGoogleAuthData(response)
              this.router.navigate(["/dashboard"])
            },
            error: (error) => {
              console.error("Google authentication error:", error)
              this.router.navigate(["/login"])
            },
          })
        } else {
          console.error("No valid access token found")
          this.router.navigate(["/login"])
        }
      })
      .catch((error) => {
        console.error("OAuth process error:", error)
        this.router.navigate(["/login"])
      })
  }
}
