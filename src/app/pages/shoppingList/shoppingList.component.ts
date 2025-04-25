import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shoppingList.component.html',
  styleUrls: ['./shoppingList.component.scss']
})
export class ShoppingListComponent {
}
