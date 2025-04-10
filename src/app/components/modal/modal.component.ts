import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  inject,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | null = null;

  @ViewChild('modalContent') modalContent!: TemplateRef<unknown>;

  @Input() confirmAction = 'Confirmar';
  @Input() cancelAction = 'Cancelar';
  @Input() modalBodyClass = 'modal-body';
  @Input() modalFooterClass = 'modal-footer d-flex justify-content-end';
  @Input() modalContentClass = 'modal-content';
  @Input() hideFooter = false;
  @Input() hideCancelOption = false;
  @Input() hideConfirmAction = false;
  @Input() customValidation = false;
  @Input() useCustomBackGround = false;
  @Input() isLoading = false;
  @Input() loadingConfirmationMethod = false;

  @Output() callConfirmationMethod = new EventEmitter<void>();
  @Output() callCancelMethod = new EventEmitter<void>();

  showModal(): void {
    if (this.modalRef) return;
    this.modalRef = this.modalService.open(this.modalContent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  hideModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
}
