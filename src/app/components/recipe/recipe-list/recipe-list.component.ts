import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, of, delay } from 'rxjs';
import { CATEGORY_IMAGE_MAP, IRecipe } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service';
import { ViewRecipeComponent } from '../../../pages/recipe/view-recipe/view-recipe.component';
import { ModalComponent } from '../../modal/modal.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, ModalComponent, RecipeFormComponent, ViewRecipeComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  @Input() areActionsAvailable = false;
  @Output() cook = new EventEmitter<IRecipe>();
  @Output() listInitialized = new EventEmitter<IRecipe[]>();
  itemList: IRecipe[] = [];
  selectedItem: IRecipe | null = null;
  isLoading = true;
  skeletonList: null[] = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) return;

    const userId = JSON.parse(authUser).id;
    this.loadValidRecipes(userId, 3);
  }

  loadValidRecipes(userId: number, count: number): void {
    let attempts = 0;
    const maxAttempts = 20;

    // Initialize with skeleton placeholders
    this.skeletonList = Array(count).fill(null);

    const fetchRecipe = () => {
      this.recipesService
        .getRecipesByUser(userId)
        .pipe(
          catchError(err => {
            console.error('Error al generar receta, reintentando...', err);
            return of(null);
          }),
          delay(0)
        )
        .subscribe(recipe => {
          attempts++;
          if (recipe && this.isValidRecipe(recipe)) {
            this.itemList.push(recipe);
            // Reduce skeleton count as recipes load
            this.skeletonList.pop();
          }

          if (this.itemList.length < count && attempts < maxAttempts) {
            fetchRecipe();
          }

          if (this.itemList.length === count || attempts >= maxAttempts) {
            this.listInitialized.emit(this.itemList);
            this.isLoading = false;
            this.skeletonList = [];
          }
        });
    };
    fetchRecipe();
  }

  isValidRecipe(recipe: IRecipe): boolean {
    return (
      recipe && typeof recipe.name === 'string' && recipe.name.trim() !== '' && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
    );
  }

  trackById(index: number): number {
    return index;
  }

  onCook(recipe: IRecipe): void {
    this.cook.emit(recipe);
  }

  getCategoryImage(category: string): string {
    const normalized = category.toLowerCase();
    return `assets/img/recipe/${CATEGORY_IMAGE_MAP[normalized] || 'meal1.png'}`;
  }
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement | null;
    if (imgElement) {
      imgElement.src = 'assets/img/recipe/meal1.png';
    }
  }
}
