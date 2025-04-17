import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { IRecipe, IResponse } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { SousChefComponent } from './sous-chef/sous-chef.component';
import { IngredientService } from '../../services/ingredient.service';

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
  hasIngredients = false;

  constructor(
    private router: Router,
    private ingredientService: IngredientService
  ) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) return;

    const userId = JSON.parse(authUser).id;

    this.ingredientService.getFormattedIngredientsByUser(userId).subscribe({
      next: (res: IResponse<{ id: number; name: string }[]>) => {
        localStorage.setItem('user_ingredients', JSON.stringify(res.data));
        this.hasIngredients = res.data.length > 0;
      },
      error: () => {
        this.hasIngredients = false;
      },
      complete: () => {
        setTimeout(() => this.initFlow(), 100);
      },
    });
  }

  initFlow(): void {
    this.recipeListComponent.clearRecipes();
    this.recipeListComponent.loadSkeletons(3);

    if (this.hasIngredients) {
      this.recipeListComponent.loadValidRecipesFromLocalStorage(3);
    } else {
      this.missingIngredientsModal.showModal();
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
    this.recipeListComponent.loadRandomRecipes(3);
  }

  onGoToIngredients(): void {
    this.missingIngredientsModal.hideModal();
    this.router.navigate(['/app/generateRecipes']);
  }
}
