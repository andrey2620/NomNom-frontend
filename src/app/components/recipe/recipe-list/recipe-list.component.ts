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
  private randomMode = false;

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      this.userId = JSON.parse(authUser).id;
    }
  }

  clearRecipes(): void {
    this.itemList = [];
    this.skeletonList = [];
    this.fallbackIndex = 0;
    this.fallbackMode = false;
    this.randomMode = false;
  }

  loadSkeletons(count: number): void {
    this.skeletonList.push(...Array(count).fill(null));
  }

  loadAllFallbackAnimated(count: number): void {
    this.fallbackMode = true;
    const available = fallbackRecipes.slice(this.fallbackIndex, this.fallbackIndex + count);
    const safeCount = available.length;

    this.skeletonList = Array(safeCount).fill(null);

    available.forEach((recipe, i) => {
      setTimeout(() => {
        this.itemList.push(recipe);
        this.skeletonList.pop();
        this.listInitialized.emit(this.itemList);
      }, i * 300);
    });

    this.fallbackIndex += safeCount;
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
          delay(100)
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
            const fallbackCount = count - loaded;
            this.loadAllFallbackAnimated(fallbackCount);
          }
        });
    };

    fetchRecipe();
  }

  loadRandomRecipes(count: number): void {
    if (this.skeletonList.length === 0) {
      this.loadSkeletons(count);
    }

    this.randomMode = true;
    let loaded = 0;
    let attempts = 0;
    const maxAttempts = count * 4;

    const fetchRandom = () => {
      this.recipesService
        .getRandomRecipes()
        .pipe(
          catchError(err => {
            console.error('❌ Error receta aleatoria:', err.message);
            return of(null);
          }),
          delay(100)
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
            const fallbackCount = count - loaded;
            this.loadAllFallbackAnimated(fallbackCount);
          }
        });
    };

    fetchRandom();
  }

  onGenerateMore(): void {
    const count = 3;
    this.loadSkeletons(count);

    if (this.fallbackMode) {
      this.loadAllFallbackAnimated(count);
    } else if (this.randomMode) {
      this.loadRandomRecipes(count);
    } else {
      this.loadValidRecipes(this.userId ?? 0, count);
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
