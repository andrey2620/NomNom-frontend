import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRecipe, ISearch, ISuggestions, IResponsev2 } from '../interfaces';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileService } from './profile.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService extends BaseService<IRecipe> {
  protected override source = 'recipes';
  public totalItems: number[] = [];
  private authService: AuthService = inject(AuthService);
  private toastrService: ToastService = inject(ToastService);
  private profileService: ProfileService = inject(ProfileService);
  private recipeListSignal = signal<IRecipe[]>([]);

  get recipes$() {
    return this.recipeListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 3,
  };

  linkUserRecipe(userId: number, recipeId: number): Observable<IResponsev2<IRecipe>> {
    return this.http.post<IResponsev2<IRecipe>>(`user-recipes?userId=${userId}&recipeId=${recipeId}`, {});
  }

  addRecipe(recipeDto: Partial<IRecipe>): Observable<IRecipe> {
    return this.http.post<IRecipe>(`${this.source}`, recipeDto);
  }

  getRandomRecipes(): Observable<IResponsev2<IRecipe[]>> {
    return this.http.get<IResponsev2<{ recipe: IRecipe; prompt: string }>>(`${this.source}/generator`).pipe(
      map(res => {
        if (environment.dev) {
          //console.warn('[DEBUG] Prompt generado:\n', res.data.prompt);
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
          //console.warn('[DEBUG] Prompt generado:\n', res.data.prompt);
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
          //console.warn('[DEBUG] Prompt generado:\n', res.data.prompt);
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

  deleteRecipe(userId: number, recipeId: number): void {
    this.http
      .delete<IResponsev2<null>>(`user-recipes`, {
        params: {
          userId: userId.toString(),
          recipeId: recipeId.toString(),
        },
      })
      .subscribe({
        next: () => {
          this.toastrService.showSuccess('Receta eliminada correctamente');

          // Opcional: actualizá recetas si querés refrescar la vista
          const authUser = localStorage.getItem('auth_user');
          if (!authUser) return;

          const userId = JSON.parse(authUser).id;

          if (userId) {
            this.profileService.getUserRecipes(userId, true);
          }
        },
        error: err => {
          this.toastrService.showError('Ocurrió un error al eliminar la receta' + err.message);
        },
      });
  }
}
