import { Component, OnInit } from '@angular/core'; // Asegurate de importar OnInit
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShoppingListService } from '../../../services/shoppingList.service';
import { FormsModule } from '@angular/forms';
import { IRecipe } from '../../../interfaces'; // Asegurate de importar tu interfaz


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
  public selectedRecipes: string[] = [];
  public manualIngredients: { name: string; quantity: string }[] = [];


  title = 'Pantalla para crear lista de compras';


  constructor(private router: Router, private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.loadLocalFavorites();
  }


  goToCreateList() {
    this.router.navigate(['/app/shoppingList/create']);
  }

  goToViewLists() {
    this.router.navigate(['/app/shoppingList/view']);

  }

  private loadLocalFavorites(): void {
    const stored = localStorage.getItem('localFavorites');
    this.favoriteRecipes = stored ? JSON.parse(stored) : [];
  }

  toggleSelection(recipeName: string): void {
    const index = this.selectedRecipes.indexOf(recipeName);
    if (index > -1) {
      this.selectedRecipes.splice(index, 1);
    } else {
      this.selectedRecipes.push(recipeName);
    }
  }

  isSelected(recipeName: string): boolean {
    return this.selectedRecipes.includes(recipeName);
  }

  newIngredient = {
    name: '',
    quantity: ''
  };

  // NUEVO: método para agregar un ingrediente
  addManualIngredient() {
    const { name, quantity } = this.newIngredient;

    if (!name || !quantity) {
      alert('Por favor, completa el nombre y la cantidad del ingrediente.');
      return;
    }

    this.manualIngredients.push({ name, quantity });
    this.newIngredient = { name: '', quantity: '' };
  }

  guardarLista() {
    const userId = 2; // Este valor puede venir de tu AuthService o localStorage
    if (!this.listName) return;

    this.shoppingListService.createShoppingList(userId, this.listName).subscribe({
      next: (res) => {
        console.log('Lista guardada:', res);
        alert('Lista guardada correctamente');
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Ocurrió un error al guardar la lista');
      }
    });
  }

  removeManualIngredient(item: { name: string; quantity: string }) {
    const index = this.manualIngredients.indexOf(item);
    if (index > -1) {
      this.manualIngredients.splice(index, 1);
    }
  }

}
