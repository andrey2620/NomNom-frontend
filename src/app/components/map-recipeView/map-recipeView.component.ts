import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, delay, of } from 'rxjs';
import { IRecipe, CATEGORY_IMAGE_MAP } from '../../interfaces';
import Recipes from '../recipe/recipe-list/recipes.json';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'map-recipeView',
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

  @Input() country: string = '';
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['country'] && this.country) {
      this.loadRecipes();
      this.loadSkeletons(3);
      const sectionTitle = document.querySelector('.section-title') as HTMLElement;
      if (sectionTitle) {
        sectionTitle.innerHTML = `Recetas de ${this.country}`;
      }
    }
    console.log('country', this.country);
    console.log('itemList', this.itemList);
  }

  loadRecipes(): void {
    const allRecipes: IRecipe[] = Recipes as IRecipe[];
    this.itemList = allRecipes.filter(recipe =>
      (recipe.country ?? 'Indefinido').toLowerCase() === this.country.toLowerCase()
    );
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
