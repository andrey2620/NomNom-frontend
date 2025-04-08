import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() contrast: boolean = false;
  @Input() size: 'full' | 'sm' | 'md' = 'md'; // o ajustá a lo que uses
}
