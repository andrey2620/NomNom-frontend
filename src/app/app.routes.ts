import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { IRoleType } from './interfaces';
import { codeCollectiveLandingComponent } from './pages/CodeCollectiveLandingPage/codeCollectiveLanding';
import { nomNomLandingComponent } from './pages/NomNomLandingPage/nomNomLanding';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgotPassword.component';
import { CallbackComponent } from './pages/auth/login/callbackComponent';
import { LoginComponent } from './pages/auth/login/login.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { SignUpComponent } from './pages/auth/sign-up/signup.component';
import { GenerateRecipesComponent } from './pages/generateRecipes/generateRecipes.component';
import { InteractiveMapComponent } from './pages/interactiveMap/interactiveMap.component';
import { PlanificatorPageComponent } from './pages/planificator/planificator-page.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { ShoppingListComponent } from './pages/shoppingList/shoppingList.component';
import { ShoppingListCreateComponent } from './pages/shoppingList/shoppingListCreate/shoppingList-create.component';
import { ShoppingListViewComponent } from './pages/shoppingList/shoppingListView/shoppingList-view.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  {
    path: 'nomNomLanding',
    component: nomNomLandingComponent,
    //canActivate: [GuestGuard],
  },
  {
    path: 'codeCollectiveLanding',
    component: codeCollectiveLandingComponent,
    //canActivate: [GuestGuard],
  },
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
    path: 'forgotPassword',
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
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    redirectTo: 'nomNomLanding',
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
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.superAdmin],
          name: 'Usuarios',
          showInSidebar: true,
        },
      },
      {
        path: 'generateRecipes',
        component: GenerateRecipesComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'Ingredientes',
          showInSidebar: true,
        },
      },
      {
        path: 'interactiveMap',
        component: InteractiveMapComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'Mapa interactivo',
          showInSidebar: true,
        },
      },
      {
        path: 'planificator',
        component: PlanificatorPageComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'Planificador',
          showInSidebar: true,
        },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'profile',
          showInSidebar: false,
        },
      },
      {
        path: 'profile/edit',
        component: ProfileEditComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'profile-edit',
        },
      },
      {
        path: 'recipes',
        component: RecipeComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'Generar Recetas',
          showInSidebar: true,
        },
      },
      {
        path: 'shoppingList',
        component: ShoppingListCreateComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          name: 'Lista de compras',
          showInSidebar: true,
        },
      },
      {
        path: 'shoppingList/view',
        component: ShoppingListViewComponent,
        data: {
          authorities: [IRoleType.superAdmin, IRoleType.user],
          showInSidebar: false,
        }
      },
      /*
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
    ],
  },
];
