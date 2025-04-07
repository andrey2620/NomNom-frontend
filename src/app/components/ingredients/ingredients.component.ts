import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Output() selectedChange = new EventEmitter<number[]>();

  selectedIngredients: number[] = [];

  selectIngredient(id: number | undefined | null) {
    if (id === undefined || id === null) return;

    const index = this.selectedIngredients.indexOf(id);

    if (index !== -1) {
      this.selectedIngredients.splice(index, 1);
    } else {
      // } else if (this.selectedIngredients.length < 5) {
      this.selectedIngredients.push(id);
    }

    this.selectedChange.emit(this.selectedIngredients);
  }
}
