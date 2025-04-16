import { Component, effect, inject, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IngredientsComponent } from '../../components/ingredients/ingredients.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { IngredientService } from '../../services/ingredient.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { ChipsComponent } from '../../components/chip/chips.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { forkJoin } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-ingredients-page',
  templateUrl: './generateRecipes.component.html',
  styleUrls: ['./generateRecipes.component.scss'],
  imports: [CommonModule, IngredientsComponent, LoaderComponent, PaginationComponent, FormsModule, DropdownComponent, ChipsComponent, ModalComponent],
})
export class GenerateRecipesComponent implements OnInit {
  public ingredientService: IngredientService = inject(IngredientService);
  public title = 'Buscar ingredientes';

  public searchQuery = '';
  public chosenCategory = '';
  public currentPage = 1;
  public itemsPerPage = 18;
  public selectedIngredients: number[] = [];
  public chips: string[] = [];

  private selectedIngredientNames = new Map<number, string>();
  @ViewChild('confirmModal') confirmModal!: ModalComponent;
  hasIngredients: boolean | undefined;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.ingredientService.getAll();
    effect(() => {
      const ingredients = this.ingredientService.ingredient$();
      if (ingredients.length && this.selectedIngredients.length) {
        this.onIngredientsChange(this.selectedIngredients);
      }
    });
  }

  ngOnInit() {
    const stored = localStorage.getItem('user_ingredients');

    if (stored) {
      const ingredientObjects: { id: number; name: string }[] = JSON.parse(stored);
      this.selectedIngredients = ingredientObjects.map(i => i.id);
      this.selectedIngredientNames.clear();

      ingredientObjects.forEach(obj => {
        this.selectedIngredientNames.set(obj.id, obj.name);
      });

      this.chips = ingredientObjects.map(i => i.name);
    } else {
      this.selectedIngredients = [];
      this.selectedIngredientNames.clear();
      this.chips = [];
    }
  }

  onIngredientsChange(selectedIds: number[]) {
    this.selectedIngredients = selectedIds;

    const currentIngredients = this.ingredientService.ingredient$();

    selectedIds.forEach(id => {
      if (!this.selectedIngredientNames.has(id)) {
        const ingredient = currentIngredients.find(i => i.id === id);
        if (ingredient?.name) {
          this.selectedIngredientNames.set(id, ingredient.name);
        }
      }
    });
    this.chips = selectedIds.map(id => this.selectedIngredientNames.get(id) || '').filter(name => name !== '');
  }

  onChipRemoved(chipName: string) {
    for (const [id, name] of this.selectedIngredientNames.entries()) {
      if (name === chipName) {
        this.selectedIngredients = this.selectedIngredients.filter(selectedId => selectedId !== id);
        this.selectedIngredientNames.delete(id);
        break;
      }
    }
    this.chips = this.chips.filter(name => name !== chipName);
  }

  onCategoryChange(category: string | null) {
    this.chosenCategory = category || '';
    this.filterIngredients();
  }

  filterIngredients() {
    this.currentPage = 1;

    if (!this.searchQuery.trim() && !this.chosenCategory) {
      this.ingredientService.getAll();
    } else {
      const category = this.chosenCategory || '';
      this.ingredientService.getIngredientByNameAndCategory(this.searchQuery, category, this.currentPage);
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.ingredientService.paginateIngredients(this.currentPage, this.itemsPerPage);
  }

  get totalPages(): number {
    return this.ingredientService.getTotalPages(this.itemsPerPage);
  }

  deleteIngredients(): void {
    this.confirmModal.showModal();
  }

  onModalCancel(): void {
    this.confirmModal.hideModal();
  }

  onModalConfirm(): void {
    localStorage.removeItem('user_ingredients');
    localStorage.removeItem('user_ingredients_names');
    this.selectedIngredients = [];
    this.chips = [];
    this.selectedIngredientNames.clear();
    this.confirmModal.hideModal();
    this.toastService.showSuccess('Se han eliminado todos los ingredientes seleccionados.');
  }

  saveSelectedIngredients(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.toastService.showError('No se pudo identificar al usuario.');
      return;
    }

    const storedRaw = localStorage.getItem('user_ingredients');
    const storedObjs = storedRaw ? (JSON.parse(storedRaw) as { id: number; name: string }[]) : [];
    const storedIds = storedObjs.map(i => i.id);
    const currentIds = this.selectedIngredients;

    const toAdd = currentIds.filter(id => !storedIds.includes(id));
    const toRemove = storedIds.filter(id => !currentIds.includes(id));

    if (!toAdd.length && !toRemove.length) {
      this.toastService.showInfo('No se detectaron cambios en la selección.');
      return;
    }

    const ingredientObjects = currentIds.map(id => ({
      id,
      name: this.selectedIngredientNames.get(id) || '',
    }));
    localStorage.setItem('user_ingredients', JSON.stringify(ingredientObjects));

    const requests = [];

    if (toAdd.length) {
      requests.push(this.ingredientService.bulkLinkIngredientsToUser(toAdd, userId));
    }

    if (toRemove.length) {
      requests.push(this.ingredientService.bulkDeleteIngredientsFromUser(toRemove, userId));
    }

    forkJoin(requests).subscribe({
      next: responses => {
        let added = 0,
          removed = 0;

        for (const res of responses) {
          for (const msg of Object.values(res.data)) {
            if (msg === 'Vinculado correctamente' || msg === 'Ya está vinculado') added++;
            if (msg === 'Eliminado correctamente') removed++;
          }
        }

        if (added > 0) this.toastService.showSuccess(`${added} ingrediente(s) añadido(s).`);
        if (removed > 0) this.toastService.showSuccess(`${removed} ingrediente(s) eliminado(s).`);
      },
      error: err => {
        this.toastService.showError('Error al guardar cambios: ' + err?.error?.message || err.message);
      },
    });
  }
}
