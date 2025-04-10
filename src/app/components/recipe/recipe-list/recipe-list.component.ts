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

  private fallbackIndex = 0;
  private fallbackMode = false;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      this.userId = JSON.parse(authUser).id;
    }

    this.loadSkeletons(5); // siempre mostrar skeletons desde el inicio
  }

  clearRecipes(): void {
    this.itemList = [];
    this.skeletonList = [];
    this.fallbackIndex = 0;
    this.fallbackMode = false;
  }

  loadSkeletons(count: number): void {
    this.skeletonList.push(...Array(count).fill(null));
  }

  loadAllFallbackAnimated(): void {
    this.fallbackMode = true;
    const total = fallbackRecipes.length;
    console.warn(`[FALLBACK] Mostrando todas las ${total} recetas locales.`);

    this.skeletonList = Array(total).fill(null); // Mostrar todos los skeletons

    // Delay inicial antes de empezar a mostrar las cards reales
    setTimeout(() => {
      fallbackRecipes.forEach((recipe, i) => {
        setTimeout(() => {
          this.itemList.push(recipe);
          this.skeletonList.pop();
          this.listInitialized.emit(this.itemList);
        }, i * 500);
      });

      this.fallbackIndex += total;
    }, 1200); // 🕒 Delay de 1.2 segundos antes de comenzar
  }

  loadValidRecipes(userId: number, count: number): void {
    let attempts = 0;
    let loaded = 0;
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
            loaded++;
          }

          if (loaded < count && attempts < maxAttempts) {
            fetchRecipe();
          }

          if (attempts >= maxAttempts && loaded < count) {
            this.loadAllFallbackAnimated();
          }
        });
    };

    fetchRecipe();
  }

  loadRandomRecipes(count: number): void {
    this.loadSkeletons(count);

    let loaded = 0;
    let attempts = 0;
    const maxAttempts = count * 4;

    const fetchRandom = () => {
      this.recipesService
        .getRandomRecipes()
        .pipe(
          catchError(err => {
            console.error('❌ Error receta aleatoria:', err.message);
            return of(null); // fallback a null para seguir el flujo
          }),
          delay(300)
        )
        .subscribe((recipe: IRecipe | null) => {
          attempts++;

          if (recipe && this.isValidRecipe(recipe)) {
            this.itemList.push(recipe);
            this.skeletonList.pop();
            this.listInitialized.emit(this.itemList);
            loaded++;
          }

          if (loaded < count && attempts < maxAttempts) {
            fetchRandom();
          }

          if (attempts >= maxAttempts && loaded < count) {
            this.loadAllFallbackAnimated();
          }
        });
    };

    fetchRandom();
  }

  onGenerateMore(): void {
    this.loadSkeletons(3);
    if (this.fallbackMode) {
      this.loadAllFallbackAnimated();
    } else {
      this.loadValidRecipes(this.userId ?? 0, 3);
    }
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
