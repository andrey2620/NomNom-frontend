import { Component, EventEmitter, AfterViewInit, OnInit, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, delay, EMPTY } from 'rxjs';
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
  @Output() cook = new EventEmitter<any>();
  @Output() listInitialized = new EventEmitter<any[]>();
  itemList: any[] = [];
  selectedItem: any = null;

  isLoading = true;
  skeletonList: any[] = [];

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) return;

    const userId = JSON.parse(authUser).id;
    this.loadValidRecipes(userId, 3);
  }

  // loadValidRecipes(userId: number, count: number): void {
  //   let attempts = 0;
  //   const maxAttempts = 20;

  //   // Initialize with placeholders that will be replaced
  //   this.skeletonList = Array(count).fill(null);
  //   this.itemList = Array(count).fill(null);

  //   const fetchRecipe = (index: number) => {
  //     this.recipesService
  //       .getRecipesByUser(userId)
  //       .pipe(
  //         catchError(err => {
  //           console.error('Error al generar receta, reintentando...', err);
  //           return of(null);
  //         }),
  //         delay(500)
  //       )
  //       .subscribe(recipe => {
  //         attempts++;

  //         if (recipe && this.isValidRecipe(recipe)) {
  //           // Replace the null at the specific index with the recipe
  //           this.itemList[index] = recipe;
  //           // Remove the corresponding skeleton
  //           this.skeletonList[index] = undefined;
  //         }

  //         // Find the next empty slot
  //         const nextEmptyIndex = this.itemList.findIndex(item => item === null);

  //         if (nextEmptyIndex !== -1 && attempts < maxAttempts) {
  //           // Continue fetching for the next empty slot
  //           fetchRecipe(nextEmptyIndex);
  //         } else {
  //           // Clean up null values when done
  //           this.itemList = this.itemList.filter(item => item !== null);
  //           this.listInitialized.emit(this.itemList);

  //           if (this.skeletonList.every(item => item === undefined)) {
  //             this.isLoading = false;
  //           }
  //         }
  //       });
  //   };

  //   // Start fetching for each position
  //   fetchRecipe(0);
  // }

  loadValidRecipes(userId: number, count: number): void {
    let attempts = 0;
    const maxAttempts = 20;

    // Initialize with skeleton placeholders
    this.skeletonList = Array(count).fill(null);

    const fetchRecipe = () => {
      this.recipesService
        .getRecipesByUser(userId)
        .pipe(
          catchError((err) => {
            console.error('Error al generar receta, reintentando...', err);
            return of(null);
          }),
          delay(0)
        )
        .subscribe((recipe) => {
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

  isValidRecipe(recipe: any): boolean {
    return recipe && recipe.name && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  }

  trackById(index: number, _item: any): number {
    return index;
  }

  onCook(recipe: any): void {
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
