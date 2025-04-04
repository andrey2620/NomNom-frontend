import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AllergiesService } from './allergies.service';
import { DietPreferenceService } from './dietPreference.service';


@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users';
  public userSignal = signal<IUser>({});
  private snackBar = inject(MatSnackBar);

  constructor(
    http: HttpClient,
    private dietPreferenceService: DietPreferenceService,
    private allergiesService: AllergiesService
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
        this.snackBar.open(
          `Error getting user profile info ${error.message}`,
          'Close',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  updateUserProfile(user: IUser) {
    return this.http.put(`${this.source}/${user.id}`, user).subscribe({
      next: (response: any) => {
        this.snackBar.open(
          'Perfil actualizado correctamente',
          'Cerrar',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          }
        );
        this.getUserInfoSignal();
      },
      error: (error: any) => {
        this.snackBar.open(
          `Error al actualizar perfil: ${error.message}`,
          'Cerrar',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

}