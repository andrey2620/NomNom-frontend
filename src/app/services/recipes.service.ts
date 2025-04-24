import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRecipe, ISearch, ISuggestions, IResponsev2 } from '../interfaces';
import { AuthService } from './auth.service';
import { map, Observable, of, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProfileService } from './profile.service';
import { ToastService } from './toast.service';
import { catchError, retry, throwError } from 'rxjs';


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
    if (window.location.hostname === 'localhost') {
      console.warn('Saltando generación de receta IA en entorno local');
      return of({
        data: [],
        message: 'Modo local sin IA',
        meta: {
          method: 'GET',
          url: '/recipes/generator',
          totalPages: 0,
          totalElements: 0,
          pageNumber: 1,
          pageSize: 3,
        },
      });
      
    }
  
    return this.http
      .get<IResponsev2<{ recipe: IRecipe; prompt: string }>>(`${this.source}/generator`)
      .pipe(
        retry({
          count: 2,
          delay: (_, retryCount) => {
            console.warn(`Reintentando getRandomRecipes() intento #${retryCount}...`);
            return timer(1000);
          },
        }),
        map(res => ({
          ...res,
          data: [res.data.recipe],
        })),
        catchError(err => {
          console.error('Falló getRandomRecipes():', err);
          return throwError(() => new Error('Falló al conectar con IA para recetas aleatorias'));
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

  getRecipeByName(name: string) {
    return this.http.get(`${this.source}/by-name`, {
      params: { name }
    });
  }


  addManualRecipe(recipe: any): Observable<IRecipe> {
    return this.http.post<IRecipe>('/recipes/manual', recipe);
  }
  
  
  

  
}
