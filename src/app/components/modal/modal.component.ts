import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, LoaderComponent],
  standalone: true,
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modalDialog') modalDialog!: ElementRef<HTMLDialogElement>;
  @Input() showCloseButton = true;
  @Input() closeOnClickOutside = true;
  @Input() modalContentClass = '';
  @Input() useCustomBackGround = false;
  @Input() confirmAction = '';
  @Input() cancelAction = '';
  @Input() confirmButtonClass = '';
  @Input() cancelButtonClass = '';
  @Input() hideCancelOption = false;
  @Input() hideConfirmOption = false;
  @Input() isLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() modalCancelled = new EventEmitter<void>();

  private previousActiveElement: Element | null = null;

  ngAfterViewInit() {
    if (this.modalDialog.nativeElement) {
      this.modalDialog.nativeElement.addEventListener('click', this.handleBackdropClick.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.modalDialog.nativeElement) {
      this.modalDialog.nativeElement.removeEventListener('click', this.handleBackdropClick.bind(this));
    }
  }

  showModal(): void {
    // Add a small delay to ensure the ViewChild is initialized
    setTimeout(() => {
      if (!this.modalDialog?.nativeElement) return;
      
      this.previousActiveElement = document.activeElement;
      this.modalDialog.nativeElement.showModal();
      
      const firstFocusable = this.modalDialog.nativeElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }, 0);
  }

  hideModal(): void {
    if (!this.modalDialog.nativeElement) return;
    this.modalDialog.nativeElement.close();

    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

  onConfirm(): void {
    this.confirm.emit();
    this.hideModal();
  }

  onCancel(): void {
    this.modalCancelled.emit();
    this.hideModal();
  }

  private handleBackdropClick(event: MouseEvent): void {
    if (!this.closeOnClickOutside) return;

    const rect = this.modalDialog.nativeElement.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      this.hideModal();
    }
  }
}
