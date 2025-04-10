import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, delay, of } from 'rxjs';
import { IRecipe, CATEGORY_IMAGE_MAP } from '../../../interfaces';
import fallbackRecipes from './recipes.json';
import { RecipesService } from '../../../services/recipes.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  @Input() areActionsAvailable = false;
  @Output() cook = new EventEmitter<IRecipe>();
  @Output() listInitialized = new EventEmitter<IRecipe[]>();

  userId: number | null = null;
  itemList: IRecipe[] = [];
  skeletonList: null[] = [];

  private fallbackIndex = 0; // para no repetir recetas locales si las agregás

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      this.userId = JSON.parse(authUser).id;
    }

    this.loadSkeletons(3);
    this.loadValidRecipes(this.userId ?? 0, 3);
  }

  loadSkeletons(count: number): void {
    this.skeletonList.push(...Array(count).fill(null));
  }

  loadFallbackRecipesAnimated(count: number): void {
    console.warn(`[FALLBACK] Cargando ${count} recetas locales con animación...`);

    for (let i = 0; i < count; i++) {
      const recipe = fallbackRecipes[this.fallbackIndex % fallbackRecipes.length];
      setTimeout(() => {
        this.itemList.push(recipe);
        this.skeletonList.pop();
        this.listInitialized.emit(this.itemList);
      }, i * 1000);
      this.fallbackIndex++;
    }
  }

  loadValidRecipes(userId: number, count: number): void {
    let attempts = 0;
    const maxAttempts = count * 4;

    const fetchRecipe = () => {
      this.recipesService
        .getRecipesByUser(userId)
        .pipe(
          catchError(err => {
            console.error('❌ Error al generar receta IA:', err.message);
            return of(null);
          }),
          delay(300)
        )
        .subscribe(recipe => {
          attempts++;

          if (recipe && this.isValidRecipe(recipe)) {
            this.itemList.push(recipe);
            this.skeletonList.pop();
            this.listInitialized.emit(this.itemList);
          }

          if (this.itemList.length % 3 !== 0 && attempts < maxAttempts) {
            fetchRecipe();
          }

          if (this.itemList.length % 3 === 0 || attempts >= maxAttempts) {
            if (this.itemList.length === 0) {
              this.loadFallbackRecipesAnimated(count);
            }
          }
        });
    };

    fetchRecipe();
  }

  onGenerateMore(): void {
    const count = 3;
    this.loadSkeletons(count);
    this.loadValidRecipes(this.userId ?? 0, count);
  }

  isValidRecipe(recipe: IRecipe): boolean {
    return recipe && typeof recipe.name === 'string' && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0;
  }

  onCook(recipe: IRecipe): void {
    this.cook.emit(recipe);
  }

  getCategoryImage(category: string): string {
    const normalized = category.trim().toLowerCase();
    const fileName = CATEGORY_IMAGE_MAP[normalized] || 'meal1.png';
    return `assets/img/recipe/${fileName}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/recipe/meal1.png';
  }

  trackById(index: number, item: IRecipe): string {
    return item.name;
  }
}
