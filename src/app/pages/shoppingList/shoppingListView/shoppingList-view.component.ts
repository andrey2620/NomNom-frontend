import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../../services/shoppingList.service';

@Component({
  selector: 'app-shopping-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingList-view.component.html',
  styleUrls: ['./shoppingList-view.component.scss']
})
export class ShoppingListViewComponent {

  constructor(private shoppingListService: ShoppingListService) { }

  savedLists = [
    { id: 1, name: 'Lista de Navidad' },
    { id: 2, name: 'Lista de Meriendas' },
    { id: 3, name: 'Lista de Camping' },
    { id: 4, name: 'Lista de Año Nuevo' }
  ];

  selectedListName: string = '';
  selectedListId?: number;
  selectedListItems: { name: string; checked: boolean; id: number }[] = [];

  selectList(list: any) {
    this.selectedListName = list.name;
    this.selectedListId = list.id;

    this.shoppingListService.getShoppingListDetails(list.id).subscribe({
      next: (data) => {
        this.selectedListItems = data.items.map((item: any) => ({
          name: item.ingredient ? item.ingredient.name : item.customName,
          checked: false,
          id: item.id
        }));
      },
      error: (err) => {
        console.error('Error cargando la lista:', err);
        alert('No se pudo cargar la lista seleccionada');
      }
    });
  }
}
