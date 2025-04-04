import { inject, Injectable, signal } from '@angular/core';
import { IIngredients, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class IngredientService extends BaseService<IIngredients> {
  private ingredientsSignal = signal<IIngredients[]>([]);
  private allIngredients: IIngredients[] = [];
  private filteredIngredients: IIngredients[] = [];
  private alertService: AlertService = inject(AlertService);
  protected override source: string = 'ingredients';

  public search: ISearch = {
    page: 1,
    size: 18,
  };

  public totalItems: any = [];

  get ingredient$() {
    return this.ingredientsSignal;
  }

  getAll() {
    this.findAllWithParams(this.search).subscribe({
      next: (response: IResponse<IIngredients[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.allIngredients = response.data;
        this.ingredientsSignal.set(response.data); // Muestra todos los ingredientes inicialmente
      },
      error: (err: any) => {
        console.error('error', err);
      },
    });
  }

  getIngredientByName(name: string, page: number = 1) {
    this.search.page = page; // Reinicia la búsqueda desde la página 1

    this.findAllWithParamsAndCustomSource(`name/${name}`, { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.ingredientsSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error fetching ingredient by name:', err);
      },
    });
  }

  // Aplica la paginación sobre la lista filtrada
  paginateIngredients(page: number, size: number) {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginated = this.ingredientsSignal().slice(startIndex, endIndex);
    this.ingredientsSignal.set(paginated);
  }

  // Obtiene el total de páginas en base a la lista filtrada
  getTotalPages(size: number): number {
    const filteredIngredients = this.ingredientsSignal();
    return Math.ceil(filteredIngredients.length / size);
  }

  linkIngredientToUser(ingredientId: number, userId: number) {
    return this.addCustomSource(`link/${ingredientId}/user/${userId}`, {});
  }
}
