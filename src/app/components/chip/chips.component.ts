import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ChipsComponent implements AfterViewInit, OnChanges {
  @Input() chips: { id: number; name: string; fromDb: boolean }[] = [];
  @Output() chipRemoved = new EventEmitter<number>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  hoveredIndex: number | null = null;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(): void {
    setTimeout(() => this.scrollToBottom(), 100);
  }

  removeChip(chip: { id: number; name: string; fromDb: boolean }) {
    this.chipRemoved.emit(chip.id);
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
