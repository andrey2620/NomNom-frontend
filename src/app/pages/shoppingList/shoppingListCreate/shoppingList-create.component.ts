import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShoppingListService } from '../../../services/shoppingList.service';
import { FormsModule } from '@angular/forms';
import { IRecipe } from '../../../interfaces'; 
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-shopping-list-create',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './shoppingList-create.component.html',
  styleUrls: ['./shoppingList-create.component.scss']
})
export class ShoppingListCreateComponent implements OnInit {
  public listName: string = '';
  public favoriteRecipes: IRecipe[] = [];
  public selectedRecipes: IRecipe[] = [];
  public manualIngredients: { name: string; quantity: string }[] = [];
  public lastCreatedListId?: number;




  title = 'Pantalla para crear lista de compras';


  constructor(
      private router: Router, 
      private shoppingListService: ShoppingListService,
      private profileService: ProfileService,
      private toastService: ToastService

  ) { }

  goToSavedLists(): void {
    this.router.navigate(['/app/shoppingList/view']);
  }

  clearManualIngredients(): void {
    this.manualIngredients = [];
    this.saveToLocalStorage(); 
  }
  
  ngOnInit(): void {
    this.restoreFromLocalStorage();
    this.loadFavoriteRecipes();
  }

  private restoreFromLocalStorage(): void {
    const draft = localStorage.getItem('shoppingList_draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        this.selectedRecipes = data.selectedRecipes || [];
        this.manualIngredients = data.manualIngredients || [];  // ✅ importante
        this.listName = data.listName || '';
      } catch (e) {
        console.error('Error al restaurar lista desde localStorage:', e);
      }
    }
  }
  

  private loadFavoriteRecipes(): void {
    const user = this.profileService.user$();
  
    if (user && user.recipes && user.recipes.length > 0) {
      this.favoriteRecipes = user.recipes;
    } else {
      const authUser = localStorage.getItem('auth_user');
      const userId = authUser ? JSON.parse(authUser).id : null;
  
      if (userId) {
        this.profileService.getUserRecipes(userId, true);
      }
  
      const stored = localStorage.getItem('localFavorites');
      if (stored) {
        this.favoriteRecipes = JSON.parse(stored);
      }
    }
  }
  
  goToCreateList() {
    this.router.navigate(['/app/shoppingList/create']);
  }

  goToViewLists() {
    this.router.navigate(['/app/shoppingList/view']);

  }


  toggleSelection(recipe: IRecipe): void {
    const index = this.selectedRecipes.findIndex(r => r.name === recipe.name);
  
    if (index > -1) {
      this.selectedRecipes.splice(index, 1);
      this.removeRecipeIngredients(recipe);
    } else {
      this.selectedRecipes.push(recipe);
      this.addRecipeIngredients(recipe);
    }
  
    this.saveToLocalStorage();
  }
  
  isSelected(recipe: IRecipe): boolean {
    return this.selectedRecipes.some(r => r.name === recipe.name);
  }
  

  addRecipeIngredients(recipe: IRecipe): void {
    console.log('Receta seleccionada:', recipe);
    console.log('recipe.ingredients:', recipe.ingredients);
    console.log('recipe.recipeIngredients:', (recipe as any).recipeIngredients);
  
    let ingredients = recipe.ingredients;
  
    if (!ingredients && (recipe as any).recipeIngredients) {
      ingredients = (recipe as any).recipeIngredients.map((ri: any) => ({
        name: ri.ingredient?.name || 'Ingrediente desconocido',
        quantity: ri.quantity,
        measurement: ri.measurement
      }));
    }
  
    if (!ingredients || !Array.isArray(ingredients)) {
      console.warn('No se pudieron leer los ingredientes de esta receta:', recipe);
      return;
    }
  
    ingredients.forEach(ing => {
      this.addOrUpdateIngredient(ing.name, ing.quantity, ing.measurement);
    });
  
    this.saveToLocalStorage();
    console.log('Ingredientes agregados:', this.manualIngredients);
  }

  private addOrUpdateIngredient(name: string, quantity: string, measurement?: string): void {
    const quantityText = `${quantity} ${measurement || ''}`.trim();
    const existing = this.manualIngredients.find(item => item.name === name);
  
    if (existing) {
      const currentQty = parseFloat(existing.quantity);
      const newQty = parseFloat(quantity);
  
      if (!isNaN(currentQty) && !isNaN(newQty)) {
        existing.quantity = (currentQty + newQty).toString() + (measurement ? ` ${measurement}` : '');
      } else {
        console.warn(`No se puede sumar "${existing.quantity}" + "${quantityText}"`);
      }
    } else {
      this.manualIngredients.push({
        name,
        quantity: quantityText
      });
    }
  }
  
  removeRecipeIngredients(recipe: IRecipe): void {
    let ingredients = recipe.ingredients;
  
    if (!ingredients && (recipe as any).recipeIngredients) {
      ingredients = (recipe as any).recipeIngredients.map((ri: any) => ({
        name: ri.ingredient?.name || ''
      }));
    }
  
    if (!ingredients || !Array.isArray(ingredients)) {
      console.warn('No se pudieron eliminar ingredientes. Estructura inválida:', recipe);
      return;
    }
  
    ingredients.forEach(ing => {
      this.removeOrDecreaseIngredient(ing.name, ing.quantity, ing.measurement);
    });
  
    this.saveToLocalStorage();
  }

  private removeOrDecreaseIngredient(name: string, quantity: string, measurement?: string): void {
    const existing = this.manualIngredients.find(item => item.name === name);
  
    if (!existing) return;
  
    const currentQty = parseFloat(existing.quantity);
    const removeQty = parseFloat(quantity);
  
    if (!isNaN(currentQty) && !isNaN(removeQty)) {
      const newQty = currentQty - removeQty;
  
      if (newQty > 0) {
        existing.quantity = newQty.toString() + (measurement ? ` ${measurement}` : '');
      } else {
        this.manualIngredients = this.manualIngredients.filter(item => item.name !== name);
      }
    } else {
      // Si no son numéricos, eliminamos directamente
      this.manualIngredients = this.manualIngredients.filter(item => item.name !== name);
    }
  }

  newIngredient = {
    name: '',
    quantity: ''
  };

  addManualIngredient() {
    const { name, quantity } = this.newIngredient;

    if (!name || !quantity) {
      this.toastService.showWarning('Por favor, completa el nombre y la cantidad del ingrediente.');
      return;
    }

    this.manualIngredients.push({ name, quantity });
    this.newIngredient = { name: '', quantity: '' };
    this.saveToLocalStorage();

  }

  removeManualIngredient(item: { name: string; quantity: string }) {
    const index = this.manualIngredients.indexOf(item);
    if (index > -1) {
      this.manualIngredients.splice(index, 1);
    }
  }

  guardarLista() {
    const userId = 2; // Reemplaza esto en el futuro por el usuario logueado
    if (!this.listName) {
      this.toastService.showWarning('Dale un nombre a tu lista antes de guardarla');
      return;
    }

    this.shoppingListService.createShoppingList(userId, this.listName).subscribe({
      next: (res) => {
        const listId = res.id;
        this.lastCreatedListId = listId;

        // Luego agregamos los ingredientes manuales
        if (this.manualIngredients.length > 0) {
          const itemsToAdd = this.manualIngredients.map(item => this.buildManualItemPayload(item));

          console.log('📦 Enviando items al backend:', itemsToAdd);

          this.shoppingListService.addManualItems(listId, itemsToAdd).subscribe({
            next: () => {
              this.toastService.showSuccess('Lista guardada con ingredientes manuales');
              this.resetFormulario();
            },
            error: (err) => {
              console.error('Error al agregar ingredientes:', err);
              this.toastService.showWarning('Lista creada, pero falló al agregar ingredientes.');
            }
          });
        } else {
          this.toastService.showSuccess('Lista guardada correctamente');
          this.resetFormulario();
        }
      },
      error: (err) => {
        console.error('Error al guardar la lista:', err);
        this.toastService.showError('No se pudo guardar la lista');
      }
    });
    localStorage.removeItem('shoppingList_draft');
  }

  private buildManualItemPayload(item: { name: string; quantity: string }) {
    const qtyOnly = parseFloat(item.quantity);
    const measurement = item.quantity.replace(/[0-9.]/g, '').trim() || 'unidad';
  
    return {
      customName: item.name || '',
      customQuantity: item.quantity || '',
      quantity: !isNaN(qtyOnly) ? qtyOnly : 1,
      measurement: measurement || 'unidad'
    };
  }
  
  

  resetFormulario() {
    this.listName = '';
    this.manualIngredients = [];
    this.newIngredient = { name: '', quantity: '' };
    this.selectedRecipes = [];
  }


  private saveToLocalStorage(): void {
    localStorage.setItem('shoppingList_draft', JSON.stringify({
      selectedRecipes: this.selectedRecipes,
      manualIngredients: this.manualIngredients,
      listName: this.listName
    }));
  }
  


}
