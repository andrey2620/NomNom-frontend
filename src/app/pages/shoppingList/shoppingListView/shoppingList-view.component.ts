import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../../services/shoppingList.service';
import { ToastrService } from 'ngx-toastr';

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


  constructor(private shoppingListService: ShoppingListService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.shoppingListService.getAllShoppingLists().subscribe({
      next: (res) => {
        this.savedLists = res.data ?? [];
      },
      error: () => this.toastr.error('Error al cargar las listas', 'Error')
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
          quantity: item.quantity,
          checked: false,
          id: item.id
        }));
      },
      error: (err) => {
        console.error('Error cargando la lista:', err);
        this.toastr.error('No se pudo cargar la lista seleccionada', 'Error');
      }
    });
  }

  updateListName(): void {
    if (!this.selectedListId || !this.updatedListName) {
      this.toastr.warning('Selecciona una lista y escribe un nuevo nombre', 'Advertencia');
      return;
    }

    this.shoppingListService.updateShoppingListName(this.selectedListId, this.updatedListName).subscribe({
      next: () => {
        this.toastr.success('Nombre actualizado correctamente', 'Éxito');
        const list = this.savedLists.find(l => l.id === this.selectedListId);
        if (list) list.name = this.updatedListName;
        this.selectedListName = this.updatedListName;
        this.updatedListName = '';
      },
      error: () => {
        this.toastr.error('Error al actualizar el nombre', 'Error');
      }
    });
  }

  downloadListPdf() {
    if (!this.selectedListId) {
      this.toastr.warning('Selecciona una lista para descargar', 'Advertencia');
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
        this.toastr.error('Error al descargar el PDF', 'Error');
      }
    });
  }

  deleteSelectedList() {
    if (!this.selectedListId) {
      this.toastr.warning('Primero selecciona una lista', 'Advertencia');
      return;
    }


    this.shoppingListService.deleteShoppingList(this.selectedListId).subscribe({
      next: () => {
        this.toastr.success('Lista eliminada correctamente', 'Éxito');
        this.savedLists = this.savedLists.filter(list => list.id !== this.selectedListId);
        this.selectedListId = undefined;
        this.selectedListName = '';
        this.selectedListItems = [];
      },
      error: () => this.toastr.error('Ocurrió un error al eliminar la lista', 'Error')
    });
  }

}
