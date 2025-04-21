import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-list-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingList-create.component.html',
  styleUrls: ['./shoppingList-create.component.scss']
})
export class ShoppingListCreateComponent {
  public listName: string = '';
}
