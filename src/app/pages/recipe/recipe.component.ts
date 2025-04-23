import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { RecipeListComponent } from '../../components/recipe/recipe-list/recipe-list.component';
import { SousChefComponent } from '../../components/recipe/sous-chef/sous-chef.component';
import { ViewRecipeComponent } from '../../components/recipe/view-recipe/view-recipe.component';
import { IRecipe, IResponse } from '../../interfaces';
import { IngredientService } from '../../services/ingredient.service';
import { ProfileService } from '../../services/profile.service';
import { RecipesService } from '../../services/recipes.service';
import { ToastService } from '../../services/toast.service';

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
  currentTitle = 'Recetas';
  public mostrarRecipeList = false;
  userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;
  selectedRecipe: IRecipe | null = null;
  hasIngredients = false;

  constructor(
    private router: Router,
    private ingredientService: IngredientService,
    private recipeService: RecipesService,
    public profileService: ProfileService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) return;

    this.userId = JSON.parse(authUser).id;
    this.profileService.getUserRecipes(this.userId);
    this.ingredientService.getFormattedIngredientsByUser(this.userId).subscribe({
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

    if (localStorage.getItem('mapRecipe')) {
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
    const user = localStorage.getItem('auth_user');
    if (!user) return;

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.id;

    const normalize = (str: string) => str.replace(/\s+/g, ' ').replace(/[.,;]/g, '').trim().toLowerCase();

    const newInstructions = normalize(recipe.instructions || '');

    console.log('%c🔍 Instrucciones de la receta seleccionada (normalizadas):', 'color: #3498db');
    console.log(newInstructions);

    console.log('%c📋 Instrucciones de recetas del usuario (normalizadas):', 'color: #e67e22');
    parsedUser.recipes?.forEach((r: IRecipe, index: number) => {
      const normalized = normalize(r.instructions || '');
      console.log(`Receta #${index + 1}:`, normalized);
    });

    const alreadyExists = parsedUser.recipes?.some((r: IRecipe) => {
      const existingInstructions = normalize(r.instructions || '');
      return existingInstructions === newInstructions;
    });

    if (alreadyExists) {
      this.toastService.showWarning('Esta receta ya la guardaste, selecciona otra.');
      return;
    }

    const dto = {
      name: recipe.name,
      recipeCategory: recipe.recipeCategory,
      preparationTime: recipe.preparationTime,
      description: recipe.description || '',
      nutritionalInfo: recipe.nutritionalInfo || '',
      instructions: recipe.instructions,
      ingredients: recipe.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        measurement: ing.measurement || '',
      })),
    };

    this.recipeService.addRecipe(dto).subscribe({
      next: (response: IRecipe) => {
        this.recipeService.linkUserRecipe(userId, (response as IRecipe).data.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Receta guardada correctamente');
          },
          error: (err: unknown) => {
            this.toastService.showSuccess('Error al vincular receta al usuario' + err);
          },
          complete: () => {
            this.profileService.getUserRecipes(userId, true);
          },
        });
      },
      error: (err: Error) => {
        this.toastService.showSuccess('Error al guardar la receta:' + err);
      },
    });
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
    console.log('onGoToIngredients');
    this.missingIngredientsModal.hideModal();
    this.router.navigate(['/app/generateRecipes']);
  }
}
