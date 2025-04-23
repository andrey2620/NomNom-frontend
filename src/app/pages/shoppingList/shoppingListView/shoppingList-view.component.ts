import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingList-view.component.html',
  styleUrls: ['./shoppingList-view.component.scss']
})
export class ShoppingListViewComponent {

  // Simulación de listas guardadas
  savedLists = [
    { name: 'Lista de Navidad' },
    { name: 'Lista de Meriendas' },
    { name: 'Lista de Camping' },
    { name: 'Lista de Año Nuevo' }
  ];

  // Ingredientes asociados a la lista seleccionada
  selectedListItems = [
    { name: 'Arroz', checked: true },
    { name: 'Pollo', checked: false },
    { name: 'Item de lista 3', checked: false },
    { name: 'Item de lista 4', checked: true },
    { name: 'Item de lista 5', checked: false },
    { name: 'Item de lista 7', checked: false }
  ];
}
