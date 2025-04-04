import { Component, effect, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { AllergiesService } from '../../services/allergies.service';
import { DietPreferenceService } from '../../services/dietPreference.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IAllergies, IDietPreferences, IUser } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  public profileService = inject(ProfileService);
  public user!: IUser;
  public snackBar = inject(MatSnackBar);
  selectedAllergies: Set<IAllergies> = new Set();
  selectedPreferences: Set<IDietPreferences> = new Set();


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public dietPreferenceService: DietPreferenceService,
    public allergiesService: AllergiesService,
    private router: Router,

  ) {
    this.profileService.getUserInfoSignal();
    this.dietPreferenceService.getAll();
    this.allergiesService.getAll();
    setTimeout(() => {
      this.user = this.profileService.user$();
    }, 500);
  }

  ngOnInit(): void {
    effect(() => {
      const user = this.profileService.user$();
      if (user?.id) {
        this.user = user;
        console.log('User cargado correctamente:', this.user);

        this.selectedAllergies = new Set(this.user.allergies || []);
        this.selectedPreferences = new Set(this.user.preferences || []);
      }
    });
  }


  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSelectedAllergy(event: Event, allergy: IAllergies) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedAllergies.add(allergy);
      allergy.isSelected = true;
    } else {
      this.selectedAllergies.delete(allergy);
      allergy.isSelected = false;
    }

    console.log('Alergias seleccionadas:', Array.from(this.selectedAllergies));
  }

  onSelectedPreference(event: Event, preference: IDietPreferences) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedPreferences.add(preference);
      preference.isSelected = true;
    } else {
      this.selectedPreferences.delete(preference);
      preference.isSelected = false;
    }

    console.log('Preferencias seleccionadas:', Array.from(this.selectedPreferences));
  }



  updateSelections() {
    const user = this.profileService.user$();

    if (!user || !user.id) {
      console.error('Error: Usuario no cargado correctamente.');
      this.snackBar.open('Error: El usuario no está cargado correctamente.', 'Cerrar', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const selectedAllergiesArray = Array.from(this.selectedAllergies);
    const selectedPreferencesArray = Array.from(this.selectedPreferences);

    const updatedUser: IUser = {
      ...user,
      allergies: selectedAllergiesArray,
      preferences: selectedPreferencesArray,
      role: user.role
    };

    console.log('Actualizando usuario con:', updatedUser);

    this.profileService.updateUserProfile(updatedUser);
  }
}