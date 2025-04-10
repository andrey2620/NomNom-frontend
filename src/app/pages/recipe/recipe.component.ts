import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { IRecipe } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { SousChefComponent } from './sous-chef/sous-chef.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, ModalComponent, RecipeListComponent, ViewRecipeComponent, SousChefComponent],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @ViewChild('recipeList') recipeListComponent!: RecipeListComponent;
  @ViewChild('missingIngredientsModal') missingIngredientsModal!: ModalComponent;

  selectedRecipe: IRecipe | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userIngredients = localStorage.getItem('user_ingredients');
    const hasIngredients = userIngredients && JSON.parse(userIngredients).length > 0;

    if (!hasIngredients) {
      setTimeout(() => this.missingIngredientsModal.showModal(), 100);
    }
  }

  onRecipeSelected(recipe: IRecipe): void {
    this.selectedRecipe = recipe;
  }

  onRecipeListInitialized(recipes: IRecipe[]): void {
    if (recipes.length > 0 && !this.selectedRecipe) {
      this.selectedRecipe = recipes[0];
    }
  }

  onRecipeSaved(recipe: IRecipe): void {
    console.log('Receta guardada:', recipe);
  }

  onRecipeDeleted(recipe: IRecipe): void {
    console.log('Receta eliminada:', recipe);
  }

  onGenerateMore(): void {
    this.recipeListComponent.onGenerateMore();
  }

  onConfirmGenerateRandom(): void {
    this.missingIngredientsModal.hideModal();
    this.recipeListComponent.clearRecipes();
    this.recipeListComponent.loadSkeletons(3);
    this.recipeListComponent.loadRandomRecipes(3);
  }

  onGoToIngredients(): void {
    this.missingIngredientsModal.hideModal();
    this.router.navigate(['/app/generateRecipes']);
  }
}
