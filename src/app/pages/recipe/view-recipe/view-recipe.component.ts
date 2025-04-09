import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORY_IMAGE_MAP, IRecipe } from '../../../interfaces';

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.scss'],
})
export class ViewRecipeComponent {
  @Input() recipe!: IRecipe;

  @Input() areActionsAvailable = false;

  @Output() save = new EventEmitter<IRecipe>();
  @Output() delete = new EventEmitter<IRecipe>();

  onSave() {
    this.save.emit(this.recipe);
  }

  onDelete() {
    this.delete.emit(this.recipe);
  }

  getCategoryImage(category: string): string {
    const normalized = category.trim().toLowerCase();
    const fileName = CATEGORY_IMAGE_MAP[normalized] || 'meal1.png';
    return `assets/img/recipe/${fileName}`;
  }

  getCleanedSteps(instructions?: string): string[] {
    return (instructions ?? '')
      .split('.')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/img/recipe/meal1.png';
  }
}
