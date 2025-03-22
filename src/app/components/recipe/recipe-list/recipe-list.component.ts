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
  @Input() itemList: IRecipe[] = [];
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

  onFormEventCalled(updated: IRecipe) {
    this.recipeService.update(updated);
    this.modalService.dismissAll();
  }

  deleteRecipe(recipe: IRecipe) {
    this.recipeService.delete(recipe);
  }
}
