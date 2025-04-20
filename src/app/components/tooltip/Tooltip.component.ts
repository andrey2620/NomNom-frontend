import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';

/**
 * @title Tooltip that demonstrates auto-hiding when it clips out of its scrolling container.
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './Tooltip.component.html',
  styleUrl: './Tooltip.component.scss',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CdkScrollable, MatButtonModule, MatTooltipModule],
})
export class TooltipComponent {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
}
