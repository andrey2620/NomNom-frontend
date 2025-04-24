/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { IIngredients } from '../../interfaces';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
})
export class IngredientsComponent {
  @Input() title = '';
  @Input() ingredients: IIngredients[] = [];
  @Input() selectedIds: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  selectedIngredients: number[] = [];
  localStorageIngredients: any[] = [];
  allergies: string[] = []; // Array para almacenar IDs de alergias

  ngOnInit() {
    const savedIngredients = localStorage.getItem('user_ingredients');
    if (savedIngredients) {
      this.localStorageIngredients = JSON.parse(savedIngredients);
    } else {
      this.localStorageIngredients = [];
    }

    // Obtener alergias del localStorage
    const userString = localStorage.getItem('auth_user');
    if (userString) {
      const user = JSON.parse(userString);
      this.allergies = user.allergies?.map((allergy: any) => allergy.name) || [];
    }

    this.selectedIngredients = [...this.selectedIds];
    this.selectedChange.emit([...this.selectedIngredients]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedIds']) {
      this.selectedIngredients = [...this.selectedIds];
    }
  }

  selectIngredient(id: number | undefined | null) {
    if (id === undefined || id === null) return;

    const index = this.selectedIngredients.indexOf(id);

    if (index !== -1) {
      this.selectedIngredients.splice(index, 1);
    } else {
      this.selectedIngredients.push(id);
    }

    this.selectedChange.emit([...this.selectedIngredients]);
  }

  isAllergy(name: string): boolean {
    return this.allergies.includes(name);
  }
}
