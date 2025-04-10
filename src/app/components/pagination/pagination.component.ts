import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() service: any;
  @Output() pageChange = new EventEmitter<number>();
  @Input() customCall: boolean = false;
  @Input() category: string | null = null;
  @Input() name: string = '';

  onPage(pPage: number) {
		this.service.search.page = pPage;
    if (this.customCall) {
      this.pageChange.emit(pPage);
    } else {
      if (!this.name && !this.category) {
        this.service.getAll();
      }
      else if(!this.name && this.category) {
        this.name = '';
        this.service.getIngredientByNameAndCategory(this.name, this.category, pPage);
      }
      else{
        this.service.getIngredientByNameAndCategory(this.name, this.category, pPage);
      }      
    }
	}
}
