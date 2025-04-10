import { Component, inject, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    LoaderComponent,
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title?: string;
  @Input() confirmAction = '';
  @Input() cancelAction = '';
  @Input() customValidation = false;
  @Input() isLoading = false;
  @Input() loadingConfirmationMethod = false;
  @Input() hideConfirmAction = false;
  @Input() useCustomBackGround = false;
  @Input() hideCancelOption = false;
  @Input() hideFooter = false;
  @Input() modalBodyClass = "modal-body";
  @Input() modalFooterClass = "modal-footer";
  @Input() modalContentClass = "modal-content";
  @Output() callCancelMethod = new EventEmitter();
  @Output() callConfirmationMethod = new EventEmitter();

  public modalService: NgbModal = inject(NgbModal);

  @ViewChild('modalContent', { static: true }) modalContent!: ElementRef;

  public show() {
    this.modalService.open(this.modalContent, { centered: true });
  }

  public hide() {
    this.modalService.dismissAll();
  }

  public hideModal() {
    this.hide();
    this.callCancelMethod.emit();
  }
}
