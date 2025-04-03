import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
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
  // allergyOptions: any[] = [];
  // preferenceOptions: any[] = [];
  selectedAllergies: Set<number> = new Set();
  selectedPreferences: Set<number> = new Set();


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
  }

  ngOnInit(): void {
    // this.user = this.authService.getUser();
    // this.preferenceOptions = this.dietPreferenceService.dietPreferences$();
    // this.allergyOptions = this.allergiesService.allergies$();
    // console.log(this.allergyOptions);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSelectedAllergy(allergy: any) {
    this.selectedAllergies.has(allergy) ? this.selectedAllergies.delete(allergy) : this.selectedAllergies.add(allergy)
    console.log(this.selectedAllergies);
  }

  onSelectedPreference(preference: any) {
    this.selectedPreferences.has(preference) ? this.selectedPreferences.delete(preference.id) : this.selectedPreferences.add(preference);
    console.log(this.selectedPreferences);
  }

  updateSelections() {
    // debugger;
    // console.log(this.allergiesService.allAllergies);
    // const selectedAllergiesArray = Array.from(this.selectedAllergies);
    // this.allergyOptions = this.allergiesService.allAllergies
    // this.preferenceOptions = this.dietPreferenceService.allDietPreferences;
    // console.log(this.preferenceOptions);
    // console.log(this.dietPreferenceService);
    // const selectedPreferencesArray = Array.from(this.selectedPreferences);

    // const updatedUser = {
    //   ...this.user,
    //   allergies: selectedAllergiesArray.join(','),
    //   diet_preference: selectedPreferencesArray.join(',')
    // };
    // this.profileService.updateUserProfile(updatedUser);
  }


}
