import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-select-custom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'select-custom.html',
  styleUrls: ['select-custom.css'],
})
export class SelectCustomComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('search') searchTextBox!: ElementRef;
  @ViewChild('selectContainer') selectContainer!: ElementRef;
  @Input() data: string[] = [];
  @Input() selectedValues: string[] = [];
  @Input() placeholder = '';
  @Output() selectionChange = new EventEmitter<string[]>();

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  isOpen = false;

  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.searchTextboxControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    // Inicializar el selectFormControl con los valores predefinidos
    this.selectFormControl.setValue(this.selectedValues);

    // Agregar listener para cerrar al hacer clic fuera
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnChanges(changes: SimpleChanges) {
    // Actualizar el control cuando cambian los valores seleccionados
    if (changes['selectedValues'] && this.selectedValues) {
      this.selectFormControl.setValue(this.selectedValues);
    }
  }

  ngOnDestroy() {
    // Remover el listener cuando el componente se destruye
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (this.selectContainer && !this.selectContainer.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.filter(option => option.toLowerCase().includes(filterValue));
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchTextboxControl.setValue('');
      setTimeout(() => {
        this.searchTextBox.nativeElement.focus();
      });
    }
  }

  onSearchFocus() {
    if (!this.isOpen) {
      this.isOpen = true;
    }
  }

  isSelected(option: string): boolean {
    return this.selectFormControl.value?.includes(option) || false;
  }

  toggleOption(option: string) {
    const currentValues = this.selectFormControl.value || [];
    const index = currentValues.indexOf(option);

    if (index === -1) {
      const newValues = [...currentValues, option];
      this.selectFormControl.setValue(newValues);
      this.selectionChange.emit(newValues);
    } else {
      currentValues.splice(index, 1);
      const newValues = [...currentValues];
      this.selectFormControl.setValue(newValues);
      this.selectionChange.emit(newValues);
    }
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchTextboxControl.setValue('');
  }

  addNewOption(value: string) {
    if (value && !this.data.includes(value)) {
      this.data.push(value);
      this.toggleOption(value);
      this.searchTextboxControl.setValue('');
    }
  }

  removeValue(value: string) {
    const currentValues = this.selectFormControl.value || [];
    const index = currentValues.indexOf(value);
    if (index !== -1) {
      currentValues.splice(index, 1);
      this.selectFormControl.setValue([...currentValues]);
    }
  }
}
