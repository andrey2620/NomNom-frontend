import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './pages/auth/login/auth-config';
interface Operator {
  name?: string;
  symbol?: string;
}

interface Calculator {
  name?: string;
  type?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: string = 'demo-angular-front';
  cant: number = 0;
  operators: Operator[] = [
    {
      name: 'addition',
      symbol: '+',
    },
    {
      name: 'subtraction',
      symbol: '-',
    },
  ];
  cal: Calculator = {
    name: 'My caculator',
    type: 'simple',
  };
  date: Date = new Date();

  operation(name: string) {
    if (name == 'addition') {
      this.cant++;
    } else if (name == 'subtraction') {
      this.cant--;
    }
  }

  constructor(private oauthService: OAuthService) {
    this.configureSSO();
  }

  private configureSSO(): void {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
