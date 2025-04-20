import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { IRecipe, IResponse } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { ViewRecipeComponent } from '../../components/recipe/view-recipe/view-recipe.component';
import { SousChefComponent } from '../../components/recipe/sous-chef/sous-chef.component';
import { IngredientService } from '../../services/ingredient.service';
import { RecipesService } from '../../services/recipes.service';

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
  public mostrarRecipeList = false;

  selectedRecipe: IRecipe | null = null;
  hasIngredients = false;

  constructor(
    private router: Router,
    private ingredientService: IngredientService,
    private recipeService: RecipesService
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mostrarRecipeList = true;
    });
  }

  initFlow(): void {
    this.recipeListComponent.clearRecipes();
    this.recipeListComponent.loadSkeletons(3);

    if(localStorage.getItem('mapRecipe')) {
      this.selectedRecipe = JSON.parse(localStorage.getItem('mapRecipe') ?? '');
      localStorage.removeItem('mapRecipe');
    }

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
    // Crea el objeto DTO para enviar al backend
    const recipeDto = {
      name: recipe.name,
      recipeCategory: recipe.recipeCategory,
      preparationTime: recipe.preparationTime,
      description: recipe.description || '', // Si es opcional, asegúrate de enviar un valor vacío si no está presente
      nutritionalInfo: recipe.nutritionalInfo || '', // Lo mismo para propiedades opcionales
      instructions: recipe.instructions,
      ingredients: recipe.ingredients.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        measurement: ingredient.measurement || '', // Si measurement es opcional
      })),
    };

    // Llama al servicio para guardar la receta
    this.recipeService.addRecipe(recipeDto).subscribe({
      next: response => {
        console.log('Receta guardada:', response);
      },
      error: err => {
        console.error('Error al guardar receta:', err);
      },
    });
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
