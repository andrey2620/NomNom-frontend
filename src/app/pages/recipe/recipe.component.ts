import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
export class RecipeComponent implements OnInit, AfterViewInit {
  @ViewChild('recipeList') recipeListComponent!: RecipeListComponent;
  @ViewChild('missingIngredientsModal') missingIngredientsModal!: ModalComponent;

  selectedRecipe: IRecipe | null = null;
  hasIngredients = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userIngredients = localStorage.getItem('user_ingredients');
    this.hasIngredients = userIngredients !== null && Array.isArray(JSON.parse(userIngredients)) && JSON.parse(userIngredients).length > 0;

    if (!this.hasIngredients) {
      setTimeout(() => this.missingIngredientsModal.showModal(), 100);
    }
  }

  ngAfterViewInit(): void {
    // ejecutamos solo si tiene ingredientes, y ya está inicializado el ViewChild
    if (this.hasIngredients) {
      this.recipeListComponent.loadSkeletons(5);
      this.recipeListComponent.loadValidRecipes(this.recipeListComponent.userId ?? 0, 5);
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
    this.recipeListComponent.loadAllFallbackAnimated();
  }

  onGoToIngredients(): void {
    this.missingIngredientsModal.hideModal();
    this.router.navigate(['/app/generateRecipes']);
  }
}
