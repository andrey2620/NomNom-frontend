import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  imports: [
      CommonModule,
      FormsModule,

    ],
})

export class ChipsComponent {
  @Input() chips: string[] = [];
  @Output() chipRemoved = new EventEmitter<string>();

  hoveredIndex: number | null = null;

  removeChip(chip: string) {
    this.chipRemoved.emit(chip);
  }
}
