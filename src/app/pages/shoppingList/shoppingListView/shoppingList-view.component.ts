import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../../services/shoppingList.service';

@Component({
  selector: 'app-shopping-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoppingList-view.component.html',
  styleUrls: ['./shoppingList-view.component.scss']
})
export class ShoppingListViewComponent implements OnInit {
  savedLists: any[] = [];
  selectedListName: string = '';
  selectedListId?: number;
  selectedListItems: { name: string; checked: boolean; id: number }[] = [];
  updatedListName: string = '';


  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.shoppingListService.getAllShoppingLists().subscribe({
      next: (res) => {
        this.savedLists = res.data ?? [];
      },
      error: () => alert('Error al cargar las listas')
    });
  }

  selectList(list: any) {
    this.selectedListName = list.name;
    this.selectedListId = list.id;
    this.updatedListName = list.name;

    this.shoppingListService.getShoppingListDetails(list.id).subscribe({
      next: (res) => {
        const listData = res.data;
        this.selectedListItems = listData.items.map((item: any) => ({
          name: item.ingredient ? item.ingredient.name : item.customName,
          checked: false,
          id: item.id
        }));
      },
      error: (err) => {
        console.error('Error cargando la lista:', err);
        alert('No se pudo cargar la lista seleccionada');
      }
    });
  }

  updateListName(): void {
    if (!this.selectedListId || !this.updatedListName) {
      alert('Selecciona una lista y escribe un nuevo nombre');
      return;
    }

    this.shoppingListService.updateShoppingListName(this.selectedListId, this.updatedListName).subscribe({
      next: () => {
        alert('Nombre actualizado correctamente');
        // Opcional: actualizar también el nombre en la UI
        const list = this.savedLists.find(l => l.id === this.selectedListId);
        if (list) list.name = this.updatedListName;
        this.selectedListName = this.updatedListName;
        this.updatedListName = '';
      },
      error: () => {
        alert('Error al actualizar el nombre');
      }
    });
  }

  downloadListPdf() {
    if (!this.selectedListId) {
      alert('Selecciona una lista para descargar');
      return;
    }

    this.shoppingListService.downloadPdf(this.selectedListId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lista-${this.selectedListName}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Error al descargar el PDF');
      }
    });
  }

  deleteSelectedList() {
    if (!this.selectedListId) {
      alert('Primero selecciona una lista');
      return;
    }

    const confirmDelete = confirm('¿Estás seguro que deseas eliminar esta lista?');
    if (!confirmDelete) return;

    this.shoppingListService.deleteShoppingList(this.selectedListId).subscribe({
      next: () => {
        alert('Lista eliminada correctamente');
        this.savedLists = this.savedLists.filter(list => list.id !== this.selectedListId);
        this.selectedListId = undefined;
        this.selectedListName = '';
        this.selectedListItems = [];
      },
      error: () => alert('Ocurrió un error al eliminar la lista')
    });
  }

}
