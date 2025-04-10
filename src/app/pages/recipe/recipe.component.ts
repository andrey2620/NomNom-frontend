import { Component, OnInit, ViewChild } from '@angular/core';
import { IRecipe } from '../../interfaces';
import { ModalComponent } from '../../components/modal/modal.component';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SousChefComponent } from './sous-chef/sous-chef.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    ModalComponent,
    RecipeListComponent,
    CommonModule,
    ViewRecipeComponent,
    SousChefComponent,
  ],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @ViewChild('missingIngredientsModal') missingIngredientsModal!: ModalComponent;
  @ViewChild('recipeList') recipeListComponent!: RecipeListComponent;

  selectedRecipe: IRecipe | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const ingredients = localStorage.getItem('user_ingredients');
    if (!ingredients || JSON.parse(ingredients).length === 0) {
      setTimeout(() => this.missingIngredientsModal.showModal(), 100);
    }
  }

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

  onGenerateMore(): void {
    this.recipeListComponent.onGenerateMore();
  }

  onConfirmGenerateRandom(): void {
    this.missingIngredientsModal.hideModal();
    this.recipeListComponent.loadRandomRecipes(3);
  }

  onGoToIngredients(): void {
    this.missingIngredientsModal.hideModal();
    this.router.navigate(['/app/generateRecipes']);
  }
}
