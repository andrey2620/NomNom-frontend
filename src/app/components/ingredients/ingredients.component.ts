import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() selectedIds: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();

  selectedIngredients: number[] = [];
  localStorageIngredients: any[] = [];

  ngOnInit() {
    const savedIngredients = localStorage.getItem('user_ingredients');
    if (savedIngredients) {
      this.localStorageIngredients = JSON.parse(savedIngredients);
    } else {
      this.localStorageIngredients = [];
    }

      // Inicializar el estado interno con lo que venga del padre (por si acaso)
    this.selectedIngredients = [...this.selectedIds];

    // Emitir los seleccionados una sola vez al inicio
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
}
