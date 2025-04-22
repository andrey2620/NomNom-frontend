/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CdkDragDrop, DragDropModule, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import { IRecipe } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-planificator-page',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './planificator-page.component.html',
  styleUrls: ['./planificator-page.component.scss'],
})
export class PlanificatorPageComponent implements OnInit {
  // Services
  public user = inject(ProfileService);

  // Data properties
  public myMenus: string[] = [];
  public myRecipes: IRecipe[] = [];
  public weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  public mealTypes = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
  public weeklyPlan: { [key: string]: { [key: string]: IRecipe[] } } = {};

  // UI state properties
  public dropListIdPrefix = 'weekly-planner';
  public showDeleteButton = false;
  public selectedItem: IRecipe | null = null;
  public selectedDay: string | null = null;
  public selectedMealType: string | null = null;
  public isMenuCollapsed = false;

  // Private properties
  private deleteTimer: any = null;

  // Category mapping
  public readonly CATEGORY_IMAGE_MAP: Record<string, string> = {
    comida: 'meal1.png',
    ensalada: 'salads.png',
    jugos: 'juices.png',
    postre: 'sweets.png',
    panes: 'breads.png',
  };

  constructor() {
    this.user.getUserInfoSignal();
    effect(() => {
      const userData = this.user.userSignal();
      if (userData && userData.id) {
        this.user.getUserRecipes(userData.id);
        this.myRecipes = userData.recipes || [];
      }
    });
  }

  ngOnInit(): void {
    this.initializeWeeklyPlan();
    this.loadMenusFromLocalStorage();
  }

  private loadMenusFromLocalStorage(): void {
    const userString = localStorage.getItem('auth_user');
    if (!userString) return;

    try {
      const user = JSON.parse(userString);
      if (Array.isArray(user.menus)) {
        this.myMenus = user.menus
          .filter((menu: { recipe: { name: any } }) => menu.recipe && menu.recipe.name)
          .map((menu: { recipe: { name: any } }) => menu.recipe.name);
      }
    } catch (e) {
      console.error('❌ Error al parsear auth_user:', e);
    }
  }

  // Initialization methods
  private initializeWeeklyPlan(): void {
    this.weekDays.forEach(day => {
      this.weeklyPlan[day] = {};
      this.mealTypes.forEach(mealType => {
        this.weeklyPlan[day][mealType] = [];
      });
    });
  }

  // Drag and drop methods
  drop(event: CdkDragDrop<any[], any, any>): void {
    if (event.previousContainer === event.container) {
      this.handleSameContainerDrop(event);
    } else {
      this.handleDifferentContainerDrop(event);
    }
  }

  private handleSameContainerDrop(event: CdkDragDrop<any[], any, any>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  private handleDifferentContainerDrop(event: CdkDragDrop<any[], any, any>): void {
    const isFromRecipeOrMenu = event.previousContainer.id === 'menu-list' || event.previousContainer.id === 'recipe-list';
    const isToRecipeOrMenu = event.container.id === 'menu-list' || event.container.id === 'recipe-list';

    // Check max items limit
    if (isFromRecipeOrMenu && !isToRecipeOrMenu && event.container.data.length >= 3) {
      return;
    }

    if (isFromRecipeOrMenu && !isToRecipeOrMenu) {
      copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    } else if (isToRecipeOrMenu) {
      return; // Prevent dragging from planner to recipes/menus
    } else {
      if (event.container.data.length >= 3) {
        return; // Skip moving if the destination container already has 3 items
      }

      const itemToMove = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(event.currentIndex, 0, itemToMove);
    }
  }

  dragStarted(): void {
    this.cancelDeleteTimer();
    this.showDeleteButton = false;
    this.selectedItem = null;
    this.selectedDay = null;
    this.selectedMealType = null;
  }

  // ID management for drag and drop
  getDropListId(day: string, mealType: string): string {
    return `${day}-${mealType}`;
  }

  getDropListIds(): string[] {
    const ids: string[] = ['menu-list', 'recipe-list'];
    this.weekDays.forEach(day => {
      this.mealTypes.forEach(mealType => {
        ids.push(this.getDropListId(day, mealType));
      });
    });
    return ids;
  }

  // Delete functionality
  startDeleteTimer(day: string, mealType: string, item: IRecipe): void {
    this.cancelDeleteTimer();
    this.deleteTimer = setTimeout(() => {
      this.showDeleteButton = true;
      this.selectedItem = item;
      this.selectedDay = day;
      this.selectedMealType = mealType;
    }, 10);
  }

  cancelDeleteTimer(): void {
    if (this.deleteTimer) {
      clearTimeout(this.deleteTimer);
      this.deleteTimer = null;
    }
    this.showDeleteButton = false;
    this.selectedItem = null;
    this.selectedDay = null;
    this.selectedMealType = null;
  }

  deleteItem(day: string, mealType: string, item: IRecipe): void {
    const index = this.weeklyPlan[day][mealType].indexOf(item);
    if (index !== -1) {
      this.weeklyPlan[day][mealType].splice(index, 1);
    }
    this.cancelDeleteTimer();
  }

  // UI helpers
  toggleMenuCollapse(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  // Category and image handling
  getCategoryImage(category: string): string {
    if (!category) {
      return `assets/img/recipe/meal1.png`;
    }
    const normalized = category.trim().toLowerCase();
    const fileName = this.CATEGORY_IMAGE_MAP[normalized] || 'meal1.png';
    return `assets/img/recipe/${fileName}`;
  }

  getRecipeCategory(recipeName: string): string {
    const lowerName = recipeName.toLowerCase();
    if (lowerName.includes('arroz')) return 'comida';
    if (lowerName.includes('pollo')) return 'comida';
    if (lowerName.includes('camarones')) return 'comida';
    if (lowerName.includes('tamales')) return 'comida';
    if (lowerName.includes('curry')) return 'comida';
    if (lowerName.includes('leche')) return 'postre';
    return 'comida';
  }
}
