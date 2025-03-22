import { Component, Input } from '@angular/core';
import { IRecipe } from '../../interfaces';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe!: IRecipe;
}
