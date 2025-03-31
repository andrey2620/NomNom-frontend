import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AllergiesService } from '../../services/allergies.service';
import { DietPreferenceService } from '../../services/dietPreference.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IAllergies, IDietPreferences } from '../../interfaces';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  allergyOptions: any[] = [];
  preferenceOptions: any[] = [];
  selectedAllergies: Set<number> = new Set();
  selectedPreferences: Set<number> = new Set();


  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dietPreferenceService: DietPreferenceService,
    private allergiesService: AllergiesService,
    private profileService: ProfileService,
    private router: Router,

  ) {
    this.user = this.authService.getUser();
  }


  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.dietPreferenceService.getAll();
    this.allergiesService.getAll();

    this.preferenceOptions = this.dietPreferenceService.dietPreferences$();
    this.allergyOptions = this.allergiesService.allergies$();
  }


  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  updateSelections() {

    const selectedAllergiesArray = Array.from(this.selectedAllergies);
    const selectedPreferencesArray = Array.from(this.selectedPreferences);

    const updatedUser = {
      ...this.user,
      allergies: selectedAllergiesArray.join(','),
      diet_preference: selectedPreferencesArray.join(',')
    };
    this.profileService.updateUserProfile(updatedUser);
  }


}
