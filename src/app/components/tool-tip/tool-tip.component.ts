import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

/**
 * @title Tooltip that demonstrates auto-hiding when it clips out of its scrolling container.
 */
@Component({
  selector: 'app-tool-tip',
  standalone: true,
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CdkScrollable, MatButtonModule, MatTooltipModule, CommonModule],
})
export class TooltipComponent {
  @Input() tooltipText = 'Tooltip';
  @Input() tooltipPosition: TooltipPosition = 'above';
  @Input() iconClass = 'fa-solid fa-floppy-disk';
  @Input() buttonClass = 'btn border-0 shadow-none h1 pt-1';
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
