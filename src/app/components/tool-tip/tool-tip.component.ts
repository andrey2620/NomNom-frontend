import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

/**
 * @title Tooltip that demonstrates auto-hiding when it clips out of its scrolling container.
 */
@Component({
  selector: 'app-tool-tip',
  standalone: true,
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss', './../../pages/profile/profile.component.scss'],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatTooltipModule, CommonModule],
})
export class TooltipComponent {
  @Input() tooltipText = 'Tooltip';
  @Input() tooltipPosition: TooltipPosition = 'above';
  @Input() iconClass = 'fa-solid fa-floppy-disk';
  @Input() buttonClass = '';
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
