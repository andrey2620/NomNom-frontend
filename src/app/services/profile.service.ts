import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  protected override source: string = 'users/me';
  private userSignal = signal<IUser>({});
  private snackBar = inject(MatSnackBar);

  get user$() {
    return this.userSignal;
  }

  getUserInfoSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        this.userSignal.set(response);  // Actualiza el valor de la señal
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
  getUser() {
    return this.userSignal();  // Accede al valor actual de la señal
  }

  updateUserProfile(user: IUser) {
    return this.http.put(`${this.source}`, user).subscribe({
      next: (response) => {
        // Actualización exitosa
        this.snackBar.open(
          'Perfil actualizado correctamente',
          'Cerrar',
          {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          }
        );
        this.userSignal.set(response);
      },
      error: (error) => {
        // En caso de error
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
