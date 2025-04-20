import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { IUser } from '../interfaces';
import { AllergiesService } from './allergies.service';
import { BaseService } from './base-service';
import { DietPreferenceService } from './dietPreference.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService<IUser> {
  protected override source = 'users';
  public userSignal = signal<IUser>({});

  constructor(
    private dietPreferenceService: DietPreferenceService,
    private allergiesService: AllergiesService,
    private toastService: ToastService,
    private router: Router
  ) {
    super();
  }

  get user$() {
    return this.userSignal;
  }

  getUserInfoSignal() {
    this.http.get<any>('users/me').subscribe({
      next: (response: any) => {
        const userData = response.data;
        this.userSignal.set(userData);

        setTimeout(() => {
          // Marca alergias seleccionadas
          this.allergiesService.allAllergies.forEach(allergy => {
            allergy.isSelected = userData.allergies?.some((a: any) => a.id === allergy.id) ?? false;
          });

          // Marca preferencias seleccionadas
          this.dietPreferenceService.allDietPreferences.forEach(preference => {
            preference.isSelected = userData.preferences?.some((p: any) => p.id === preference.id) ?? false;
          });
        }, 200); // Pequeña espera para asegurarnos que ya cargaron las listas
      },
      error: (error: any) => {
        this.toastService.showWarning(`Error getting user profile info ${error.message}`);
      },
    });
  }

  updateUserProfile(user: IUser) {
    return this.http.put(`${this.source}/${user.id}`, user).subscribe({
      next: (response: any) => {
        this.toastService.showSuccess('Perfil actualizado correctamente', '', {
          positionClass: 'toast-bottom-right',
        });

        this.getUserInfoSignal();
        this.router.navigateByUrl('/app/profile');
      },
      error: (error: any) => {
        this.toastService.showWarning(`Error al actualizar perfil: ${error.message}`);
      },
    });
  }

  getUserRecipes(userId: string | number | undefined, forceRefresh = false) {
    if (!userId) return;

    const currentUser = this.userSignal();

    // Solo salteamos si NO queremos forzar y ya hay recetas
    if (!forceRefresh && currentUser.recipes && currentUser.recipes.length > 0) return;

    return this.http.get(`${environment.apiUrl}/user-recipes/all?userId=${userId}`).subscribe({
      next: (response: any) => {
        const authUser = localStorage.getItem('auth_user');

        this.userSignal.set({ ...currentUser, recipes: response.data });

        if (authUser && Array.isArray(response.data)) {
          const parsedUser = JSON.parse(authUser);
          delete parsedUser.recipes;

          const updatedUser = {
            ...parsedUser,
            recipes: response.data,
          };

          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
      },
      error: (error: any) => {
        this.toastService.showWarning(`Error getting user recipes: ${error.message}`);
      },
    });
  }
}
