import { Component, Input } from '@angular/core';
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
}