import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-list-drop-down',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shoppingListDropDown.component.html',
  styleUrls: ['./shoppingListDropDown.component.scss'],
})
export class ShoppingListDropDownComponent implements OnInit {
  isOpen = false;
  isActive = false;

  @ViewChild('dropdownContainer') dropdownRef!: ElementRef;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Detecta ruta inicial
    this.checkIfActive(this.router.url);

    // Escucha cambios de ruta (NavigationEnd = ruta final)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkIfActive(event.urlAfterRedirects);
      });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  private checkIfActive(url: string) {
    this.isActive = url.includes('/shoppingList');
  }
}
