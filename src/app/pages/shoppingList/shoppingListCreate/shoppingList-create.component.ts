import { Component, OnInit } from '@angular/core'; // Asegurate de importar OnInit
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShoppingListService } from '../../../services/shoppingList.service';
import { FormsModule } from '@angular/forms';
import { IRecipe } from '../../../interfaces'; // Asegurate de importar tu interfaz
import { ProfileService } from '../../../services/profile.service';


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
    private profileService: ProfileService
  ) { }

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
        this.manualIngredients = data.manualIngredients || [];
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
      const exists = this.manualIngredients.some(item => item.name === ing.name);
      if (!exists) {
        this.manualIngredients.push({
          name: ing.name,
          quantity: `${ing.quantity} ${ing.measurement || ''}`.trim()
        });
      }
    });

    this.saveToLocalStorage();
    console.log('Ingredientes agregados:', this.manualIngredients);
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
      this.manualIngredients = this.manualIngredients.filter(item => item.name !== ing.name);
    });

    this.saveToLocalStorage();
  }




  newIngredient = {
    name: '',
    quantity: ''
  };

  addManualIngredient() {
    const { name, quantity } = this.newIngredient;

    if (!name || !quantity) {
      alert('Por favor, completa el nombre y la cantidad del ingrediente.');
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
    const userId = 2;
    if (!this.listName) {
      alert('Debes darle un nombre a la lista');
      return;
    }

    this.shoppingListService.createShoppingList(userId, this.listName).subscribe({
      next: (res) => {
        const listId = res.id;
        this.lastCreatedListId = listId;


        if (this.manualIngredients.length > 0) {
          const itemsToAdd = this.manualIngredients.map(item => ({
            ingredientId: null,
            name: item.name,
            quantity: item.quantity,
            measurement: null
          }));

          this.shoppingListService.addManualItems(listId, itemsToAdd).subscribe({
            next: () => {
              alert('Lista guardada correctamente con ingredientes manuales');
              this.resetFormulario();
            },
            error: (err) => {
              console.error('Error al agregar ingredientes:', err);
              alert('Lista creada pero falló al agregar ingredientes');
            }
          });
        } else {
          alert('Lista guardada correctamente');
          this.resetFormulario();
        }
      },
      error: (err) => {
        console.error('Error al guardar la lista:', err);
        alert('Ocurrió un error al guardar la lista');
      }
    });
    localStorage.removeItem('shoppingList_draft');
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
