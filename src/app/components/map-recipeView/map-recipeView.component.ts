import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CATEGORY_IMAGE_MAP, IRecipe } from '../../interfaces';
import Recipes from '../recipe/recipe-list/recipes.json';

@Component({
  selector: 'app-map-recipe-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-recipeView.component.html',
  styleUrls: ['./map-recipeView.component.scss'],
})
export class MapRecipeViewComponent implements OnChanges {
  skeletonList: null[] = [];
  itemList: IRecipe[] = [];
  private recipeIndex = 0;
  private fallbackMode = false;
  private randomMode = false;

  @Output() listInitialized = new EventEmitter<IRecipe[]>();
  @Output() cook = new EventEmitter<IRecipe>();

  @Input() country = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'] && this.country) {
      this.loadRecipes();
      const recipeTitle = document.querySelector('.section-title') as HTMLHeadingElement;
      if (recipeTitle) {
        recipeTitle.innerHTML = `Recetas de <br /> ${this.country}`;
      }
    }
  }

  loadRecipes(): void {
    const allRecipes: IRecipe[] = Recipes as IRecipe[];
    this.itemList = allRecipes.filter(recipe => (recipe.country ?? 'Indefinido').toLowerCase() === this.country.toLowerCase());
  }

  loadSkeletons(count: number): void {
    this.skeletonList.push(...Array(count).fill(null));
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
}
