import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IIngredients } from '../../interfaces';
import { IngredientService } from '../../services/ingredient.service';

@Component({
    selector: 'app-ingredients',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ingredients.component.html',
    styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent {
    @Input() title: string = '';
    @Input() ingredients: IIngredients[] = [];

    selectedIngredients: (number | null)[] = []; // Guarda hasta 5 IDs seleccionados

    selectIngredient(id: number | undefined | null) {
        if (id === undefined || id === null) return;

        const index = this.selectedIngredients.indexOf(id);

        if (index !== -1) {
            // Si ya está seleccionado, quitarlo
            this.selectedIngredients.splice(index, 1);
        } else if (this.selectedIngredients.length < 5) {
            // Si hay menos de 5 seleccionados, agregarlo
            this.selectedIngredients.push(id);
        }
        
    }
    
}
