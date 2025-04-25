import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
    categories: string[] = [
        'Vegetales', 'Frutas', 'Carnes', 'Mariscos', 'Lácteos',
        'BebidaVegetal', 'Granos', 'Pastas', 'Legumbres', 'Nueces', 'DeOrigenVegetal', 'Semillas', 'Aceites', 'Condimentos', 'ProductoDeNuez', 'Grasa', 'Dulces', 'Jugos', 'Alcohol',
    ];

    selectedCategory: string | null = null;

    @Output() categorySelected = new EventEmitter<string | null>();

    selectCategory(category: string | null) {
        this.selectedCategory = category;
        this.categorySelected.emit(category);
    }
}
