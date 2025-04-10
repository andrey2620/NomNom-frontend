import { Component, inject } from '@angular/core';
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
    ChipsComponent
    //ModalComponent,
    //PreferenceListFormComponent
  ],
})
export class GenerateRecipesComponent {
  public ingredientService: IngredientService = inject(IngredientService);
  //public modalService: ModalService = inject(ModalService);
  //public fb: FormBuilder = inject(FormBuilder);
  //@ViewChild('addIngredientModal') public addIngredientModal: any;
  public title = 'Buscar ingredientes';

  public searchQuery = ''; // Cadena de búsqueda
  public chosenCategory = ''; // Categoría
  public currentPage = 1; // Página actual
  public itemsPerPage = 18; // Elementos por página
  selectedIngredients: number[] = [];
  public chips: string[] = [];

  private selectedIngredientNames: Map<number, string> = new Map();

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.ingredientService.getAll();
  }

  onIngredientsChange(selectedIds: number[]) {
    this.selectedIngredients = selectedIds;
    
    // Actualiza el mapa de nombres
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
    console.log('changepage: ' + this.chosenCategory);
    this.ingredientService.paginateIngredients(this.currentPage, this.itemsPerPage);
  }

  get totalPages(): number {
    return this.ingredientService.getTotalPages(this.itemsPerPage);
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
          if (status === 'Vinculado correctamente') {
            successCount++;
          } else if (status === 'Ya está vinculado') {
            warningCount++;
          } else {
            this.toastService.showError(`Error con ingrediente ${ingredientId}: ${status}`);
          }
        }

        if (successCount > 0) {
          this.toastService.showSuccess(`${successCount} ingrediente(s) vinculados correctamente.`);
        }

        if (warningCount > 0) {
          this.toastService.showWarning(`${warningCount} ingrediente(s) ya estaban vinculados.`);
        }
      },
      error: (error: { error: { message: string; }; }) => {
        const errorMessage = error?.error?.message || 'Ocurrió un error al vincular los ingredientes.';
        this.toastService.showError(errorMessage);
      },
    });
  }
}