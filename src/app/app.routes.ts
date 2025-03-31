import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SignUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { ProfileComponent } from './pages/profile/profile.component';
import { GamesComponent } from './pages/games/games.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PreferenceListPageComponent } from './pages/preferenceList/preference-list.component';
import { CallbackComponent } from './pages/auth/login/CallbackComponent';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgotPassword.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { GenerateRecipesComponent } from './pages/generateRecipes/generateRecipes.component';
import { InteractiveMapComponent } from './pages/interactiveMap/interactiveMap.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path:'forgotPassword',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },

  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
    {
      path: 'callback',
      component: CallbackComponent,
    },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: {
          authorities: [
            IRoleType.superAdmin
          ],
          name: 'Users',
          showInSidebar: true
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Dashboard',
          showInSidebar: true
        }
      },
      {
        path: 'generateRecipes',
        component: GenerateRecipesComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Recetas',
          showInSidebar: true
        }
      },
      {
        path: 'interactiveMap',
        component: InteractiveMapComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'Mapa interactivo',
          showInSidebar: true
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user
          ],
          name: 'profile',
          showInSidebar: false
        }
      },
      {
        path: 'games',
        component: GamesComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'games',
          showInSidebar: true
        }
      },
      {
        path: 'orders',
        component: OrdersComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'orders',
          showInSidebar: true
        }
      },
      {
        path: 'preference-list',
        component: PreferenceListPageComponent,
        data: {
          authorities: [
            IRoleType.superAdmin,
            IRoleType.user,
          ],
          name: 'preference list',
          showInSidebar: true
        }
      }
    ],
  },
];