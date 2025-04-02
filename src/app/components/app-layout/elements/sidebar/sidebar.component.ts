import { CommonModule } from '@angular/common';
import { Route, RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../../../services/layout.service';
import { AuthService } from '../../../../services/auth.service';
import { SvgIconComponent } from '../../../svg-icon/svg-icon.component';
import { routes } from '../../../../app.routes';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  public permittedRoutes: Route[] = [];
  public showLeftArrow = false;
  public showRigthArrow = false;
  constructor(public layoutService: LayoutService) {}
  ngOnInit(): void {
    this.permittedRoutes = this.getPermittedRoutes();
  }

  private getPermittedRoutes(): Route[] {
    const user = this.authService.getUser();
    if (!user || !user['authorities']) {
      console.warn('No user found or no authorities assigned.');
      return [];
    }

    return (
      routes
        .find(route => route.path === 'app')
        ?.children?.filter(route => {
          return route.data?.['authorities']?.some((auth: string) =>
            user['authorities']?.some((userAuth: { authority: string }) => userAuth.authority === auth)
          );
        }) || []
    );
  }
}
