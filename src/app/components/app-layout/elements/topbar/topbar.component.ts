import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

import { IUser } from '../../../../interfaces';
import { MyAccountComponent } from '../../../my-account/my-account.component';

declare let bootstrap: any;

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MyAccountComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public user?: IUser;
  public menuItems: { path: string; name: string }[] = [];

  @ViewChild('navbarContent', { static: false }) navbarContent!: ElementRef;

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

        const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(normalizedUserRole);

        return show && hasAccess;
      })
      .map(r => ({
        path: `/app/${r.path}`,
        name: r.data?.['name'] || r.path,
      }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const isToggler = targetElement.closest('.navbar-toggler');

    if (
      this.navbarContent &&
      !this.navbarContent.nativeElement.contains(targetElement) &&
      !isToggler &&
      this.navbarContent.nativeElement.classList.contains('show')
    ) {
      const bsCollapse = bootstrap.Collapse.getInstance(this.navbarContent.nativeElement);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }

  handleMenuClick(): void {
    if (this.navbarContent?.nativeElement?.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(this.navbarContent.nativeElement);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
