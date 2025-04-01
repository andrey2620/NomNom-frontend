import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IRecipe } from '../../../interfaces';

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.scss'], 
})
export class ViewRecipeComponent {
  @Input() recipe!: IRecipe;
  @Input() areActionsAvailable: boolean = false;
  
  @Output() save = new EventEmitter<IRecipe>();
  @Output() delete = new EventEmitter<IRecipe>();

  onSave() {
    this.save.emit(this.recipe);
  }

  onDelete() {
    this.delete.emit(this.recipe);
  }
}