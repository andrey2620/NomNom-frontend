import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  protected override source: string = 'users';
  public userSignal = signal<IUser>({});
  private snackBar = inject(MatSnackBar);

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
        this.snackBar.open(`Error getting user profile info ${error.message}`, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
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

  getUserRecipes(userId: string | number | undefined) {
    if (!userId) return;
    
    // Check if recipes are already loaded to prevent unnecessary calls
    const currentUser = this.userSignal();
    if (currentUser.recipes && currentUser.recipes.length > 0) return;
    
    return this.http.get(`${environment.apiUrl}/user-recipes/all?userId=${userId}`).subscribe({
      next: (response: any) => {
        const currentUser = this.userSignal();
        this.userSignal.set({ ...currentUser, recipes: response.data });
      },
      error: (error: any) => {
        this.snackBar.open(`Error getting user recipes: ${error.message}`, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }
    });
  }
}
