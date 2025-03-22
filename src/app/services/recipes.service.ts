import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRecipe, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends BaseService<IRecipe> {
  protected override source: string = 'recipes'; // Ajusta esto si tu endpoint usa otro nombre

  private recipeListSignal = signal<IRecipe[]>([]);
  get recipes$() {
    return this.recipeListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  };

  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ?? 0 },
          (_, i) => i + 1
        );
        this.recipeListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error al obtener recetas', err);
      }
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
      }
    });
  }

  update(recipe: IRecipe) {
    this.edit(recipe.id_recipe!, recipe).subscribe({
        next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll(); // o `this.getAllByUser()` si aplica
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error al actualizar la receta', 'center', 'top', ['error-snackbar']);
        console.error('Error', err);
      }
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
      }
    });
  }
}
