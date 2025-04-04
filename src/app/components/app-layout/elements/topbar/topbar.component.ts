import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../interfaces';
import { LayoutService } from '../../../../services/layout.service';
import { MyAccountComponent } from '../../../my-account/my-account.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterLink, MyAccountComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public user?: IUser;
  public menuItems: { path: string, name: string }[] = [];



  constructor(
    public router: Router,
    public layoutService: LayoutService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  
    const userRole = this.user?.role?.name?.toUpperCase();
    const normalizedUserRole = `ROLE_${userRole}`;

  
    const appRoute = this.router.config.find(route => route.path === 'app');
    const children = appRoute?.children || [];
  
    this.menuItems = children
      .filter(r => {
        const show = r.data?.['showInSidebar'];
        const allowedRoles: string[] = r.data?.['authorities'] || [];
        
        console.log('Allowed Roles:', allowedRoles);
        console.log('User Role:', userRole);

        const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(normalizedUserRole);

        return show && hasAccess;
      })
      .map(r => ({
        path: `/app/${r.path}`,
        name: r.data?.['name'] || r.path
      }));
  }
  

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
