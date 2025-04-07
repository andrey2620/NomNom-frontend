import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title = '¡Éxito!', options?: Partial<IndividualConfig>) {
    this.toastr.success(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'increasing',
      ...options
    });
  }

  showError(message: string, title = '¡Error!', options?: Partial<IndividualConfig>) {
    this.toastr.error(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'increasing',
      ...options
    });
  }

  showWarning(message: string, title = 'Advertencia', options?: Partial<IndividualConfig>) {
    this.toastr.warning(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'increasing',
      ...options
    });
  }

  showInfo(message: string, title = 'Información', options?: Partial<IndividualConfig>) {
    this.toastr.info(message, title, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      progressAnimation: 'increasing',
      ...options
    });
  }
}
