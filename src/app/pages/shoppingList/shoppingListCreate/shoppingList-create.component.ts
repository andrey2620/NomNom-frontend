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
  public lastCreatedListId?: number;




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


  removeManualIngredient(item: { name: string; quantity: string }) {
    const index = this.manualIngredients.indexOf(item);
    if (index > -1) {
      this.manualIngredients.splice(index, 1);
    }
  }

  guardarLista() {
    const userId = 2; // Reemplaza esto en el futuro por el usuario logueado
    if (!this.listName) {
      alert('Debes darle un nombre a la lista');
      return;
    }

    this.shoppingListService.createShoppingList(userId, this.listName).subscribe({
      next: (res) => {
        const listId = res.id;
        this.lastCreatedListId = listId;

        // Luego agregamos los ingredientes manuales
        if (this.manualIngredients.length > 0) {
          const itemsToAdd = this.manualIngredients.map(item => ({
            ingredientId: null, // null o dejarlo sin enviar si no existe
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
  }

  resetFormulario() {
    this.listName = '';
    this.manualIngredients = [];
    this.newIngredient = { name: '', quantity: '' };
    this.selectedRecipes = [];
  }

  downloadPdf() {
    if (!this.lastCreatedListId) {
      alert('Primero debes guardar una lista.');
      return;
    }

    this.shoppingListService.downloadPdf(this.lastCreatedListId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lista-${this.listName}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
        alert('Error al descargar la lista');
      }
    });
  }


}
