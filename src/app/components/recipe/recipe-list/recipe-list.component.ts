import { Component, EventEmitter, AfterViewInit, OnInit, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, delay, EMPTY } from 'rxjs';
import { CATEGORY_IMAGE_MAP, IRecipe } from '../../../interfaces';
import { RecipesService } from '../../../services/recipes.service';
import { ViewRecipeComponent } from '../../../pages/recipe/view-recipe/view-recipe.component';
import { ModalComponent } from '../../modal/modal.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, ModalComponent, RecipeFormComponent, ViewRecipeComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})

export class RecipeListComponent implements OnInit {
  @Input() areActionsAvailable = false;
  @Output() cook = new EventEmitter<any>();
  @Output() listInitialized = new EventEmitter<any[]>();
  itemList: any[] = [];
  selectedItem: any = null;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) return;

    const userId = JSON.parse(authUser).id;
    this.loadValidRecipes(userId, 3);
  }

  loadValidRecipes(userId: number, count: number): void {
    let attempts = 0;
    const maxAttempts = 20;

    const fetchRecipe = () => {
      this.recipesService.getRecipesByUser(userId).pipe(
        catchError(err => {
          console.error('Error al generar receta, reintentando...', err);
          return of(null);
        }),
        delay(500)
      ).subscribe(recipe => {
        attempts++;
        if (recipe && this.isValidRecipe(recipe)) {
          this.itemList.push(recipe);
        }

        if (this.itemList.length < count && attempts < maxAttempts) {
          fetchRecipe();
        }

        // 👇 Emitimos la lista al padre cuando ya se terminó
        if (this.itemList.length === count || attempts >= maxAttempts) {
          this.listInitialized.emit(this.itemList);
        }
      });
    };

    fetchRecipe();
  }

  isValidRecipe(recipe: any): boolean {
    return recipe &&
           recipe.name &&
           Array.isArray(recipe.ingredients) &&
           recipe.ingredients.length > 0;
  }

  trackById(index: number, _item: any): number {
    return index;
  }

  onCook(recipe: any): void {
    this.cook.emit(recipe);
  }

  getCategoryImage(category: string): string {
    const normalized = category.toLowerCase();
    return `assets/img/recipe/${CATEGORY_IMAGE_MAP[normalized] || 'meal1.png'}`;
  }
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement | null;
    if (imgElement) {
      imgElement.src = 'assets/img/recipe/meal1.png';
    }
  }

}