/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CdkDragDrop, DragDropModule, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { IMenu, IMenuCreateDTO, IRecipe } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';
import { PlanificatorService } from '../../services/planificator.service';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

export const dayMap: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

export const reverseDayMap: Record<string, string> = Object.fromEntries(Object.entries(dayMap).map(([k, v]) => [v, k]));

export const mealMap: Record<string, string> = {
  BREAKFAST: 'Desayuno',
  LUNCH: 'Almuerzo',
  SNACK: 'Merienda',
  DINNER: 'Cena',
};

export const reverseMealMap: Record<string, string> = Object.fromEntries(Object.entries(mealMap).map(([k, v]) => [v, k]));

@Component({
  selector: 'app-planificator-page',
  standalone: true,
  imports: [DragDropModule, CommonModule, FormsModule],
  templateUrl: './planificator-page.component.html',
  styleUrls: ['./planificator-page.component.scss'],
})
export class PlanificatorPageComponent implements OnInit {
  // Services
  public user = inject(ProfileService);
  public planificatorService = inject(PlanificatorService);
  public toast = inject(ToastService);

  // Data properties
  public myMenus: IMenu[] = [];
  public myRecipes: IRecipe[] = [];
  public weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  public mealTypes = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];
  public weeklyPlan: { [key: string]: { [key: string]: IRecipe[] } } = {};
  public selectedMenuId: number | null = null;

  // UI state properties
  public dropListIdPrefix = 'weekly-planner';
  public showDeleteButton = false;
  public selectedItem: IRecipe | null = null;
  public selectedDay: string | null = null;
  public selectedMealType: string | null = null;
  public isMenuCollapsed = false;
  public reverseDayMap: Record<string, string> = reverseDayMap;
  public reverseMealMap: Record<string, string> = reverseMealMap;
  public newMenuName = '';

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
    this.refreshMenusFromBackend();
  }

  public loadMenuIntoPlanner(menu: IMenu): void {
    this.clearWeeklyPlan();
    this.selectedMenuId = menu.id;
    this.newMenuName = menu.name;

    if (!menu.items || menu.items.length === 0) return;

    for (const item of menu.items) {
      const day = dayMap[item.dayOfWeek];
      const meal = mealMap[item.mealType];

      if (!day || !meal) continue;

      const alreadyExists = this.weeklyPlan[day][meal].some(r => r.id === item.recipe.id);
      if (!alreadyExists && this.weeklyPlan[day][meal].length < 3) {
        this.weeklyPlan[day][meal].push(item.recipe);
      }
    }
  }

  private initializeWeeklyPlan(): void {
    this.weekDays.forEach(day => {
      this.weeklyPlan[day] = {};
      this.mealTypes.forEach(mealType => {
        this.weeklyPlan[day][mealType] = [];
      });
    });
  }

  public saveCurrentPlannerAsMenu(): void {
    const trimmedName = this.newMenuName.trim();

    if (!trimmedName) {
      this.toast.showError('❌ El nombre del menú no puede estar vacío.');
      return;
    }

    const nameAlreadyExists = this.myMenus.some(menu => {
      const sameName = menu.name.trim().toLowerCase() === trimmedName.toLowerCase();
      const differentId = this.selectedMenuId === null || menu.id !== this.selectedMenuId;
      return sameName && differentId;
    });

    if (nameAlreadyExists) {
      this.toast.showError('❌ Ya existe un menú con ese nombre. Usá uno diferente.');
      return;
    }

    const userString = localStorage.getItem('auth_user');
    if (!userString) return;

    const user = JSON.parse(userString);
    const userId = user.id;

    const items: IMenuCreateDTO['items'] = [];

    for (const day in this.weeklyPlan) {
      for (const mealType in this.weeklyPlan[day]) {
        const recipes = this.weeklyPlan[day][mealType];
        for (const recipe of recipes) {
          items.push({
            recipeId: recipe.id,
            dayOfWeek: this.reverseDayMap[day],
            mealType: this.reverseMealMap[mealType],
          });
        }
      }
    }

    if (items.length === 0) {
      this.toast.showError('❌ No hay recetas en el planificador. Agregá al menos una antes de guardar.');
      return;
    }

    const payload: IMenuCreateDTO = {
      name: trimmedName,
      userId,
      items,
    };

    // 🧠 Validar si hubo cambios
    if (this.selectedMenuId && !this.hasMenuChanged()) {
      this.toast.showInfo('ℹ️ No hiciste ningún cambio en el menú.');
      return;
    }

    // 🔄 lógica: si hay un menú seleccionado, actualizalo; si no, crealo
    if (this.selectedMenuId) {
      this.planificatorService.updateMenuById(this.selectedMenuId, payload).subscribe({
        next: res => {
          this.toast.showSuccess('✅ Menú actualizado correctamente!');
          this.refreshMenusFromBackend();
          this.newMenuName = payload.name;
          this.loadMenuIntoPlanner({ ...res.data });
        },
        error: err => {
          console.error('❌ Error al actualizar el menú:', err);
          this.toast.showError('❌ No se pudo actualizar el menú.');
        },
      });
    } else {
      this.planificatorService.createMenu(payload).subscribe({
        next: res => {
          this.toast.showSuccess('✅ Menú creado exitosamente!');
          this.refreshMenusFromBackend();
          this.newMenuName = '';
        },
        error: err => {
          console.error('❌ Error al crear el menú:', err);
          this.toast.showError('❌ Error al crear el menú. Intenta nuevamente.');
        },
      });
    }
  }
  private hasMenuChanged(): boolean {
    if (!this.selectedMenuId) return true; // Es nuevo, entonces sí cambió

    const selectedMenu = this.myMenus.find(menu => menu.id === this.selectedMenuId);
    if (!selectedMenu) return true;

    const currentName = this.newMenuName.trim();
    const originalName = selectedMenu.name.trim();
    if (currentName !== originalName) return true;

    // Convertir el weeklyPlan actual a una lista de strings para comparar
    const currentItems = this.getCurrentPlannerItemKeys();
    const originalItems = selectedMenu.items.map(i => `${i.dayOfWeek}-${i.mealType}-${i.recipe.id}`);

    if (currentItems.length !== originalItems.length) return true;

    const sortedCurrent = [...currentItems].sort();
    const sortedOriginal = [...originalItems].sort();

    return sortedCurrent.some((val, i) => val !== sortedOriginal[i]);
  }

  private getCurrentPlannerItemKeys(): string[] {
    const keys: string[] = [];
    for (const day in this.weeklyPlan) {
      for (const meal in this.weeklyPlan[day]) {
        const recipes = this.weeklyPlan[day][meal];
        recipes.forEach(recipe => {
          keys.push(`${this.reverseDayMap[day]}-${this.reverseMealMap[meal]}-${recipe.id}`);
        });
      }
    }
    return keys;
  }

  private clearWeeklyPlan(): void {
    this.weekDays.forEach(day => {
      this.mealTypes.forEach(mealType => {
        this.weeklyPlan[day][mealType] = [];
      });
    });
  }

  private refreshMenusFromBackend(): void {
    const userString = localStorage.getItem('auth_user');
    if (!userString) return;

    const user = JSON.parse(userString);
    const userId = user.id;

    this.planificatorService.getMenuById(userId).subscribe({
      next: res => {
        const updatedUser = { ...user, menus: res.data };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        this.myMenus = res.data;
        console.log('✅ Menús actualizados desde backend');
      },
      error: err => {
        console.error('❌ Error al actualizar menús:', err);
      },
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
  public createNewMenu(): void {
    this.clearWeeklyPlan();
    this.newMenuName = '';
    this.selectedMenuId = null;
  }
}
