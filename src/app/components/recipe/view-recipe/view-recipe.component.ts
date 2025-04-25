import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from '../../tool-tip/tool-tip.component';
import { CATEGORY_IMAGE_MAP, IRecipe } from '../../../interfaces';
import { SousChefComponent } from '../sous-chef/sous-chef.component';
import { UserService } from '../../../services/user.service'; 
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule, TooltipComponent, SousChefComponent],
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.scss'],
})
export class ViewRecipeComponent {
  @Input() recipe!: IRecipe;

  @Input() areActionsAvailable = false;

  @Output() save = new EventEmitter<IRecipe>();
  @Output() delete = new EventEmitter<IRecipe>();

  constructor(private userService: UserService,   private toastService: ToastService) {}

  //el padre lo guarda
  saveRecipe(): void {
    this.save.emit(this.recipe);
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
