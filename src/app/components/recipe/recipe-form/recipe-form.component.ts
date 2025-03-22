import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IRecipe } from '../../../interfaces';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  @Input() title: string = 'Agregar Receta';
  @Input() toUpdateRecipe: IRecipe = {
    name: '',
    description: '',
    instructions: '',
    preparation_time: 0,
    nutritional_info: '',
    image_url: ''
  };

  @Output() callParentEvent: EventEmitter<IRecipe> = new EventEmitter<IRecipe>();

  onSubmit() {
    this.callParentEvent.emit(this.toUpdateRecipe);
  }
}
