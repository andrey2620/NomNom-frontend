import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRecipe } from '../../interfaces';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    CommonModule,
    RecipeListComponent,
    ViewRecipeComponent
  ],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  selectedRecipe: IRecipe | null = null;

  onRecipeSelected(recipe: IRecipe) {
    this.selectedRecipe = recipe;
  }

  onRecipeListInitialized(recipes: IRecipe[]) {
    if (recipes.length > 0 && !this.selectedRecipe) {
      this.selectedRecipe = recipes[0]; //para que no se me ponda vacio
    }
  }

  onRecipeSaved(recipe: IRecipe) {
    console.log('Receta guardada:', recipe);
  }
  
  onRecipeDeleted(recipe: IRecipe) {
    console.log('Receta eliminada:', recipe);
  }
}
