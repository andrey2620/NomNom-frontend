import { Component, inject, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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
  @Input() confirmAction: string = '';
  @Input() cancelAction: string = '';
  @Input() customValidation: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() loadingConfirmationMethod: boolean = false;
  @Input() hideConfirmAction: boolean = false;
  @Input() useCustomBackGround: boolean = false;
  @Input() hideCancelOption: boolean = false;
  @Input() hideFooter: boolean = false;
  @Input() modalBodyClass: string = "modal-body";
  @Input() modalFooterClass: string = "modal-footer";
  @Input() modalContentClass: string = "modal-content";
  @Output() callCancelMethod = new EventEmitter();
  @Output() callConfirmationMethod = new EventEmitter();

  public modalService: NgbModal = inject(NgbModal);

  @ViewChild('modalContent', { static: true }) modalContent!: any;

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
