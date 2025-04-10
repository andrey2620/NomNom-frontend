import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  hoveredIndex: number | null = null;
  chipInput: string = '';

  addChip() {
    const trimmed = this.chipInput.trim();
    if (trimmed && !this.chips.includes(trimmed)) {
      this.chips.push(trimmed);
    }
    this.chipInput = '';
  }

  removeChip(index: number) {
    this.chips.splice(index, 1);
  }
}
