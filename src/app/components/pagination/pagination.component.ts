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

  onPage(pPage: number) {
		this.service.search.page = pPage;
    if (this.customCall) {
      this.pageChange.emit(pPage);
    } else {
      this.service.getAll();
    }
	}
}
