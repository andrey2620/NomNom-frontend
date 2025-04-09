import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRecipe } from '../../interfaces';

import fallbackRecipes from '../../components/recipe/recipe-list/recipes.json';
import { RecipesService } from '../../services/recipes.service';
import { catchError, finalize, of } from 'rxjs';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { SousChefComponent } from './sous-chef/sous-chef.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, RecipeListComponent, ViewRecipeComponent, SousChefComponent],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent {
  selectedRecipe: IRecipe | null = null;

  onRecipeSelected(recipe: IRecipe) {
    this.selectedRecipe = recipe;
  }

  onRecipeListInitialized(recipes: IRecipe[]) {
    if (recipes.length > 0 && !this.selectedRecipe) {
      this.selectedRecipe = recipes[0];
    }
  }

  onRecipeSaved(recipe: IRecipe) {
    console.log('Receta guardada:', recipe);
  }

  onRecipeDeleted(recipe: IRecipe) {
    console.log('Receta eliminada:', recipe);
  }
}