import { CommonModule } from '@angular/common';
import { Component, effect, EnvironmentInjector, inject, OnInit, runInInjectionContext } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { SelectCustomComponent } from '../../components/select-custom/select-custom';
import { IAllergies, IDietPreferences, IUser } from '../../interfaces';
import { AllergiesService } from '../../services/allergies.service';
import { DietPreferenceService } from '../../services/dietPreference.service';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-profile-edit',
  imports: [CommonModule, SelectCustomComponent],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  public profileService = inject(ProfileService);
  public user!: IUser;
  public snackBar = inject(MatSnackBar);
  selectedAllergies: Set<IAllergies> = new Set<IAllergies>();
  selectedPreferences: Set<IDietPreferences> = new Set<IDietPreferences>();
  public selectedAllergiesArray: IAllergies[] = [];
  public selectedPreferencesArray: IDietPreferences[] = [];
  envInjector = inject(EnvironmentInjector);
  constructor(
    public dietPreferenceService: DietPreferenceService,
    public allergiesService: AllergiesService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.profileService.getUserInfoSignal();
    this.dietPreferenceService.getAll();
    this.allergiesService.getAll();
    setTimeout(() => {
      this.user = this.profileService.user$();
    }, 500);
  }

  ngOnInit(): void {
    this.profileService.getUserInfoSignal();
    runInInjectionContext(this.envInjector, () => {
      effect(() => {
        this.profileService.user$();
        this.allergiesService.allergies$();
        this.dietPreferenceService.dietPreferences$();
      });
    });
  }

  /*   ngOnInit(): void {

    effect(() => {
      const user = this.profileService.user$();
      if (user?.id) {
        this.user = user;

        this.selectedAllergies = new Set(this.user.allergies ?? []);
        this.selectedPreferences = new Set(this.user.preferences ?? []);
      }
    });
  } */

  onSelectedAllergy(event: Event, allergy: IAllergies) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedAllergies.add(allergy);
      allergy.isSelected = true;
    } else {
      this.selectedAllergies.delete(allergy);
      allergy.isSelected = false;
    }
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
  }

  updateSelections() {
    const user = this.profileService.user$();

    if (!user || !user.id) {
      return this.toastService.showWarning('El usuario no está cargado correctamente.');
    }

    this.selectedAllergiesArray = this.allergiesService.allAllergies.filter(a => a.isSelected);
    this.selectedPreferencesArray = this.dietPreferenceService.allDietPreferences.filter(p => p.isSelected);

    const updatedUser: IUser = {
      ...user,
      allergies: this.selectedAllergiesArray,
      preferences: this.selectedPreferencesArray,
      role: user.role,
    };

    this.profileService.updateUserProfile(updatedUser);

    const authUserRaw = localStorage.getItem('auth_user');
    if (authUserRaw) {
      const localUser = JSON.parse(authUserRaw);

      const cleanedAllergies = this.selectedAllergiesArray.map(a => ({ id: a.id, name: a.name }));
      const cleanedPreferences = this.selectedPreferencesArray.map(p => ({ id: p.id, name: p.name }));

      const updatedLocalUser = {
        ...localUser,
        allergies: cleanedAllergies,
        preferences: cleanedPreferences,
      };

      localStorage.setItem('auth_user', JSON.stringify(updatedLocalUser));
    }

    this.router.navigateByUrl('/app/profile');
  }

  getAllergiesNames() {
    return this.allergiesService.allAllergies.map(allergy => allergy.name);
  }

  getAllergiesUserIsSelected() {
    return this.allergiesService.allAllergies.filter(allergy => allergy.isSelected).map(allergy => allergy.name);
  }

  syncSelectedAllergies(selectedNames: string[]) {
    this.allergiesService.allAllergies.forEach(allergy => {
      allergy.isSelected = selectedNames.includes(allergy.name);
    });

    this.selectedAllergiesArray = this.allergiesService.allAllergies.filter(a => a.isSelected);

    this.allergiesService.allAllergies = [...this.allergiesService.allAllergies];
  }

  getDietPreferencesNames() {
    return this.dietPreferenceService.allDietPreferences
      .map(preference => preference.name)
      .filter((name): name is string => name !== undefined && name !== null);
  }

  getDietPreferencesUserIsSelected() {
    return this.dietPreferenceService.allDietPreferences
      .filter(preference => preference.isSelected)
      .map(preference => preference.name)
      .filter((name): name is string => name !== undefined && name !== null);
  }

  syncSelectedPreferences(selectedNames: string[]) {
    this.dietPreferenceService.allDietPreferences.forEach(preference => {
      preference.isSelected = preference.name ? selectedNames.includes(preference.name) : false;
    });

    this.selectedPreferences = new Set(this.dietPreferenceService.allDietPreferences.filter(p => p.isSelected));

    this.dietPreferenceService.allDietPreferences = [...this.dietPreferenceService.allDietPreferences];
  }
}
