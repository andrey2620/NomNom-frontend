import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

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

  @Output() confirmEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

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
    setTimeout(() => {
      if (!this.modalDialog?.nativeElement) return;

      this.previousActiveElement = document.activeElement;
      this.modalDialog.nativeElement.showModal();
      this.modalDialog.nativeElement.classList.add('opening');

      setTimeout(() => {
        this.modalDialog.nativeElement.classList.remove('opening');
      }, 300);

      const firstFocusable = this.modalDialog.nativeElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();
      }
    }, 0);
  }

  private closeModalWithAnimation(): void {
    if (!this.modalDialog.nativeElement) return;

    this.modalDialog.nativeElement.classList.add('closing');
    setTimeout(() => {
      this.modalDialog.nativeElement.close();
      this.modalDialog.nativeElement.classList.remove('closing');
      if (this.previousActiveElement instanceof HTMLElement) {
        this.previousActiveElement.focus();
      }
    }, 300);
  }

  private shakeModal(): void {
    if (!this.modalDialog.nativeElement) return;

    // Evitar múltiples animaciones simultáneas
    if (this.modalDialog.nativeElement.classList.contains('shake')) return;

    this.modalDialog.nativeElement.classList.add('shake');
    setTimeout(() => {
      this.modalDialog.nativeElement.classList.remove('shake');
    }, 400);
  }

  private handleBackdropClick(event: MouseEvent): void {
    const rect = this.modalDialog.nativeElement.getBoundingClientRect();
    const isInDialog =
      rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      if (this.closeOnClickOutside) {
        this.closeModalWithAnimation();
      } else {
        this.shakeModal();
      }
    }
  }

  hideModal(): void {
    if (!this.modalDialog.nativeElement) return;
    this.closeModalWithAnimation();
  }

  onConfirm(): void {
    this.confirmEvent.emit();
    this.hideModal();
  }

  onCancel(): void {
    this.cancelEvent.emit();
    this.hideModal();
  }
}
