import { Component, effect, inject, ViewChild } from '@angular/core';
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
import { IIngredients } from '../../interfaces';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  standalone: true,
  selector: 'app-ingredients-page',
  templateUrl: './generateRecipes.component.html',
  styleUrls: ['./generateRecipes.component.scss'],
  imports: [
    CommonModule,
    IngredientsComponent,
    LoaderComponent,
    PaginationComponent,
    FormsModule,
    DropdownComponent,
    ChipsComponent,
    ModalComponent
  ],
})
export class GenerateRecipesComponent {
  public ingredientService: IngredientService = inject(IngredientService);
  public title = 'Buscar ingredientes';

  public searchQuery = ''; // Cadena de búsqueda
  public chosenCategory = ''; // Categoría
  public currentPage = 1; // Página actual
  public itemsPerPage = 18; // Elementos por página
  public selectedIngredients: number[] = [];
  public chips: string[] = [];

  private selectedIngredientNames: Map<number, string> = new Map();
  @ViewChild('confirmModal') confirmModal!: ModalComponent;

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
    const savedIngredients = localStorage.getItem('user_ingredients');
    const savedNames = localStorage.getItem('user_ingredients_names');

    if (savedIngredients && savedNames) {
        // Recuperamos los IDs
        this.selectedIngredients = JSON.parse(savedIngredients);
        
        // Recuperamos los nombres y los asignamos al Map
        const namesArray = JSON.parse(savedNames);
        this.selectedIngredientNames.clear();
        
        // Mapeamos los IDs con sus nombres
        this.selectedIngredients.forEach((id, index) => {
            this.selectedIngredientNames.set(id, namesArray[index]);
        });
    } else {
        this.selectedIngredients = [];
        this.selectedIngredientNames.clear();
    }
  }

  onIngredientsChange(selectedIds: number[]) {
    this.selectedIngredients = selectedIds;
    
    // Actualiza el mapeo de chips
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
    // Busca en el mapa para encontrar el ID
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

  // Se activa cuando el usuario escribe en la barra de búsqueda
  filterIngredients() {

    this.currentPage = 1; // Reinicia la paginación a la primera página

    if (!this.searchQuery.trim() && !this.chosenCategory) {
      // Si la búsqueda y la categoria estan vacías, muestra todos los ingredientes
      this.ingredientService.getAll();
    } 
    
    else {
      const category = this.chosenCategory || '';
      this.ingredientService.getIngredientByNameAndCategory(this.searchQuery, category, this.currentPage);
    }

  }  

  // Se activa cuando cambia de página
  changePage(page: number) {
    this.currentPage = page;
    this.ingredientService.paginateIngredients(this.currentPage, this.itemsPerPage);
  }

  get totalPages(): number {
    return this.ingredientService.getTotalPages(this.itemsPerPage);
  }


  deleteIngredients(): void{
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

    if (!this.selectedIngredients.length) {
      this.toastService.showError('Debe seleccionar al menos un ingrediente.');
      return;
    }

    this.ingredientService.bulkLinkIngredientsToUser(this.selectedIngredients, userId).subscribe({
      next: (response: { data: any; }) => {
        const result = response.data;
        let successCount = 0;
        let warningCount = 0;

        for (const [ingredientId, status] of Object.entries(result)) {
          if (status === 'Vinculado correctamente' || status === 'Ya está vinculado') {
            successCount++;
          } /*else if (status === 'Ya está vinculado') {
            warningCount++;
          }*/ else {
            this.toastService.showError(`Error con ingrediente ${ingredientId}: ${status}`);
          }
        }

        this.toastService.showSuccess(`${successCount} ingrediente(s) vinculados correctamente.`);
        // Suponiendo que selectedIngredients es un array con los IDs de los ingredientes
        const ingredientNames = this.selectedIngredients.map(id => this.selectedIngredientNames.get(id) || '');

        // Guardamos solo los IDs en selectedIngredients
        localStorage.setItem('user_ingredients', JSON.stringify(this.selectedIngredients));

        // Guardamos los nombres en localStorage como un array de nombres
        localStorage.setItem('user_ingredients_names', JSON.stringify(ingredientNames));



        /*if (successCount > 0) {
          this.toastService.showSuccess(`${successCount} ingrediente(s) vinculados correctamente.`);
        }

        if (warningCount > 0) {
          this.toastService.showWarning(`${warningCount} ingrediente(s) ya estaban vinculados.`);          
        }*/
      },
      error: (error: { error: { message: string; }; }) => {
        const errorMessage = error?.error?.message || 'Ocurrió un error al vincular los ingredientes.';
        this.toastService.showError(errorMessage);
      },
    });
  }
}