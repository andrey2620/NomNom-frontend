import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAllergies, IDietPreferences, IUser } from '../../interfaces';
import { AllergiesService } from '../../services/allergies.service';
import { DietPreferenceService } from '../../services/dietPreference.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public profileService = inject(ProfileService);
  public user!: IUser;
  public snackBar = inject(MatSnackBar);
  selectedAllergies: Set<IAllergies> = new Set<IAllergies>();
  selectedPreferences: Set<IDietPreferences> = new Set<IDietPreferences>();

  constructor(
    public dietPreferenceService: DietPreferenceService,
    public allergiesService: AllergiesService
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

    effect(() => {
      const user = this.profileService.user$();
      if (user?.id) {
        this.user = user;
        // console.log('User cargado correctamente:', this.user);

        this.selectedAllergies = new Set(this.user.allergies || []);
        this.selectedPreferences = new Set(this.user.preferences || []);
      }
    });
  }
}
