import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import fallbackRecipes from './recipes.json';
import { catchError, finalize, of } from 'rxjs';
import { CATEGORY_IMAGE_MAP, IRecipe } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service'; // Adjust the path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  @Input() areActionsAvailable = false;

  @Output() cook = new EventEmitter<IRecipe>();
  @Output() listInitialized = new EventEmitter<IRecipe[]>();

  itemList: IRecipe[] = [];
  skeletonList = Array(3);

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {
    this.loadRecipesFromIA();
  }

  loadRecipesFromIA(): void {
    this.skeletonList = Array(3);
    const userId = 3;

    this.recipeService
      .getRecipesByUser(userId)
      .pipe(
        catchError(error => {
          if (error.status === 500) {
            console.warn('Error 500 - usando recetas locales');
            this.itemList = fallbackRecipes;
            this.listInitialized.emit(this.itemList);
            return of([]);
          }
          throw error;
        }),
        finalize(() => {
          this.skeletonList = [];
        })
      )
      .subscribe(data => {
        if (data.length > 0) {
          this.itemList = data;
          this.listInitialized.emit(this.itemList);
        }
      });
  }

  onCook(recipe: IRecipe): void {
    this.cook.emit(recipe);
  }

  getCategoryImage(category: string): string {
    const normalized = category.trim().toLowerCase();
    const fileName = CATEGORY_IMAGE_MAP[normalized] || 'meal1.png';
    return `assets/img/recipe/${fileName}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/recipe/meal1.png';
  }

  trackById(index: number, item: IRecipe): string {
    return item.name;
  }
}