import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipe } from '../../../interfaces';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { ModalComponent } from '../../modal/modal.component';
import { RecipesService } from '../../../services/recipes.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    RecipeFormComponent
  ],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss'
})
export class RecipeListComponent implements OnChanges {
  //@Input() itemList: IRecipe[] = [];
  itemList: IRecipe[] = [
    {
      id_recipe: 1,
      name: 'Arroz con Pollo',
      description: '1 taza de arroz\n1 pechuga de pollo\nVerduras al gusto',
      instructions: '1. Cocinar el arroz\n2. Saltear el pollo\n3. Mezclar todo',
      preparation_time: 30,
      nutritional_info: '250 kcal por porción',
      image_url: 'assets/img/recipe/juices.png'
    },
    {
      id_recipe: 2,
      name: 'Galletas de avena',
      description: '2 plátanos maduros\n1 taza de avena\nChispas de chocolate',
      instructions: '1. Machacar plátanos\n2. Mezclar con avena\n3. Hornear',
      preparation_time: 20,
      nutritional_info: '150 kcal por galleta',
      image_url: 'assets/img/recipe/meal2.png'
    },
    {
      id_recipe: 3,
      name: 'Galletas de avena',
      description: '2 plátanos maduros\n1 taza de avena\nChispas de chocolate',
      instructions: '1. Machacar plátanos\n2. Mezclar con avena\n3. Hornear',
      preparation_time: 20,
      nutritional_info: '150 kcal por galleta',
      image_url: 'assets/img/recipe/meal1.png'
    }
  ];
  
  @Input() areActionsAvailable: boolean = false;

  public selectedItem: IRecipe = {};
  private recipeService = inject(RecipesService);
  public modalService = inject(NgbModal);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areActionsAvailable']) {
      // lógica si se necesita cuando cambian las acciones disponibles
    }
  }

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
  

  
  
}
