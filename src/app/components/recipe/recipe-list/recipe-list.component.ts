import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipe } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service';
import { ViewRecipeComponent } from '../../../pages/recipe/view-recipe/view-recipe.component';
import { ModalComponent } from '../../modal/modal.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    RecipeFormComponent,
    ViewRecipeComponent
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})


export class RecipeListComponent {
  @Input() areActionsAvailable: boolean = false;

  public itemList: IRecipe[] = [
    {
      id_recipe: 1,
      name: 'Arroz con Pollo',
      description: '1 taza de arroz\n1 pechuga de pollo\nVerduras al gusto',
      instructions: '1. Cocinar el arroz\n2. Saltear el pollo\n3. Mezclar todo',
      preparation_time: 30,
      nutritional_info: '250 kcal por porción',
      categoria: 'jugos',
      image_url: 'assets/img/recipe/juices.png'
    },
    {
      id_recipe: 2,
      name: 'Galletas de avena',
      description: '2 plátanos maduros\n1 taza de avena\nChispas de chocolate',
      instructions: '1. Machacar plátanos\n2. Mezclar con avena\n3. Hornear',
      preparation_time: 20,
      nutritional_info: '150 kcal por galleta',
      categoria: 'panes',
      image_url: 'assets/img/recipe/breads.png'
    },
    {
      id_recipe: 3,
      name: 'Bowl de quinoa',
      description: '1 taza de quinoa\n1 taza de espinaca\n1/2 aguacate\nAderezo al gusto',
      instructions: '1. Cocinar la quinoa\n2. Mezclar ingredientes\n3. Servir frío',
      preparation_time: 25,
      nutritional_info: '300 kcal por porción',
      categoria: 'comida',
      image_url: 'assets/img/recipe/meal2.png'
    }
  ];

  public selectedItem: IRecipe | null = null;

  public modalService = inject(NgbModal);
  private recipeService = inject(RecipesService);

  showDetailModal(item: IRecipe, modal: any) {
    this.selectedItem = { ...item };
    modal.show();
  }

  deleteRecipe(recipe: IRecipe) {
    this.recipeService.delete(recipe);
  }

  trackById(index: number, item: IRecipe): number | undefined {
    return item.id_recipe;
  }

  onSave() {
    console.log('Guardar clickeado');
  }

  onCook(recipe: IRecipe) {
    this.selectedItem = recipe;
  }
  
}
