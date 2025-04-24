import { Component, OnInit } from '@angular/core'; // Asegurate de importar OnInit
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IRecipe } from '../../../interfaces'; // Asegurate de importar tu interfaz

@Component({
  selector: 'app-shopping-list-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingList-create.component.html',
  styleUrls: ['./shoppingList-create.component.scss']
})
export class ShoppingListCreateComponent implements OnInit {
  public listName: string = '';
  public favoriteRecipes: IRecipe[] = [];
  public selectedRecipes: string[] = [];

  title = 'Pantalla para crear lista de compras';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadLocalFavorites();
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

  goToCreateList(): void {
    this.router.navigate(['/app/shoppingList/create']);
  }

  goToViewLists(): void {
    this.router.navigate(['/app/shoppingList/view']);
  }
}
