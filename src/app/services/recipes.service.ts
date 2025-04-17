import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRecipe, ISearch, ISuggestions, IResponsev2 } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipesService extends BaseService<IRecipe> {
  protected override source = 'recipes';

  private recipeListSignal = signal<IRecipe[]>([]);
  get recipes$() {
    return this.recipeListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 3,
  };

  public totalItems: number[] = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  getRandomRecipes(): Observable<IResponsev2<IRecipe[]>> {
    return this.http.get<IResponsev2<{ recipe: IRecipe; prompt: string }>>(`${this.source}/generator`).pipe(
      map(res => {
        if (environment.dev) {
          console.warn('[DEBUG] Prompt generado:\n', res.data.prompt);
        }

        return {
          ...res,
          data: [res.data.recipe],
        };
      })
    );
  }

  getRecipesByUser(userId: number): Observable<IResponsev2<IRecipe[]>> {
    return this.http.get<IResponsev2<{ recipe: IRecipe; prompt: string }>>(`${this.source}/generator/user/${userId}`).pipe(
      map(res => {
        if (environment.dev) {
          console.warn('[DEBUG] Prompt generado:\n', res.data.prompt);
        }

        return {
          ...res,
          data: [res.data.recipe],
        };
      })
    );
  }

  generateRecipeFromIngredients(ingredientNames: string[]): Observable<IResponsev2<IRecipe[]>> {
    return this.http.post<IResponsev2<{ recipe: IRecipe; prompt: string }>>(`${this.source}/generator/ingredients`, ingredientNames).pipe(
      map(res => {
        if (environment.dev) {
          console.warn('[DEBUG] Prompt generado:\n', res.data.prompt);
        }

        return {
          ...res,
          data: [res.data.recipe],
        };
      })
    );
  }

  generateSuggestions(recipe: IRecipe): Observable<IResponsev2<ISuggestions>> {
    return this.http.post<IResponsev2<ISuggestions>>(`${this.source}/generator/suggestions`, recipe);
  }

  /*   getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ?? 0 }, (_, i) => i + 1);
        this.recipeListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error al obtener recetas', err);
      },
    });
  }

  save(recipe: IRecipe) {
    this.add(recipe).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll(); // o `this.getAllByUser()` si las recetas son por usuario
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al agregar la receta', 'center', 'top', ['error-snackbar']);
        console.error('Error', err);
      },
    });
  }

  delete(recipe: IRecipe) {
    this.del(`${recipe.id_recipe}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll(); // o `this.getAllByUser()` si aplica
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al eliminar la receta', 'center', 'top', ['error-snackbar']);
        console.error('Error', err);
      },
    });
  } */
}
