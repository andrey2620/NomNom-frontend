import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TooltipComponent } from '../../components/tool-tip/tool-tip.component';
import { IAllergies, IDietPreferences, IRecipe, IUser } from '../../interfaces';
import { AllergiesService } from '../../services/allergies.service';
import { DietPreferenceService } from '../../services/dietPreference.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, TooltipComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user!: IUser;
  public snackBar = inject(MatSnackBar);
  public loading = signal(true);
  public error = signal<string | null>(null);

  selectedAllergies: Set<IAllergies> = new Set<IAllergies>();
  selectedPreferences: Set<IDietPreferences> = new Set<IDietPreferences>();
  userRecipes: Set<IRecipe> = new Set<IRecipe>();

  constructor(
    public dietPreferenceService: DietPreferenceService,
    public allergiesService: AllergiesService,
    public profileService: ProfileService
  ) {
    effect(
      () => {
        const user = this.profileService.user$();
        if (!user) return;

        this.user = user;

        // Only call getUserRecipes if we don't already have recipes
        if (!user.recipes) {
          this.profileService.getUserRecipes(this.user.id);
        }

        this.selectedAllergies = new Set(this.user.allergies || []);
        this.selectedPreferences = new Set(this.user.preferences || []);

        if (this.user.recipes) {
          this.userRecipes = new Set(this.user.recipes || []);
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    try {
      this.loading.set(true);
      this.error.set(null);
      this.profileService.getUserInfoSignal();
      this.dietPreferenceService.getAll();
      this.allergiesService.getAll();
    } catch (err) {
      console.error(err);
      this.error.set('Failed to load user data');
      this.loading.set(false);
      this.snackBar.open('Error loading profile data', 'Close', { duration: 3000 });
    }
  }
  // Add this to your component class
  console = console;
}
