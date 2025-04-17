import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shopping-list-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingList-create.component.html',
  styleUrls: ['./shoppingList-create.component.scss']
})
export class ShoppingListCreateComponent {
  public listName: string = '';
  title = 'Pantalla para crear lista de compras';
  constructor(private router: Router) {}

  
  goToCreateList() {
    this.router.navigate(['/app/shoppingList/create']);
  }
  
  goToViewLists() {
    this.router.navigate(['/app/shoppingList/view']);
  }
  

}
