import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IngredientsComponent } from '../../components/ingredients/ingredients.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { IngredientService } from '../../services/ingredient.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IIngredients } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
    //ModalComponent,
    //PreferenceListFormComponent
  ],
})
export class GenerateRecipesComponent {
  public ingredientService: IngredientService = inject(IngredientService);
  //public modalService: ModalService = inject(ModalService);
  //public fb: FormBuilder = inject(FormBuilder);
  //@ViewChild('addIngredientModal') public addIngredientModal: any;
  public title: string = 'Buscar ingredientes';

  public searchQuery: string = ''; // Cadena de búsqueda
  public currentPage: number = 1; // Página actual
  public itemsPerPage: number = 18; // Elementos por página
  selectedIngredients: number[] = [];

  constructor(private authService: AuthService, private toastService: ToastService) {
    this.ingredientService.getAll();
  }

  // Se activa cuando el usuario escribe en la barra de búsqueda
  filterIngredients() {
    this.currentPage = 1; // Reinicia la paginación a la primera página

    if (!this.searchQuery.trim()) {
      // Si la búsqueda está vacía, muestra todos los ingredientes
      this.ingredientService.getAll();
    } else {
      // Si hay una búsqueda, filtra por nombre usando el backend
      this.ingredientService.getIngredientByName(this.searchQuery, this.currentPage);
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

    this.selectedIngredients.forEach(ingredientId => {
      this.ingredientService.linkIngredientToUser(ingredientId, userId).subscribe({
        next: response => {
          const message = response?.message || 'Ingrediente vinculado correctamente.';
          this.toastService.showSuccess(message + ' Verifique su correo electrónico para continuar.');
        },
        error: error => {
          const errorMessage = error?.error?.message || 'Error al vincular ingrediente.';
          this.toastService.showError(errorMessage);
        },
      });
    });
  }
}
