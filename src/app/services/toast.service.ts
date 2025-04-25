import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private defaultToastOptions: Partial<IndividualConfig> = {
    timeOut: 3000,
    positionClass: 'toast-top-right',
    progressBar: true,
    closeButton: true,
    progressAnimation: 'increasing',
  };

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title = '¡Éxito!', options?: Partial<IndividualConfig>) {
    const mergedOptions = { ...this.defaultToastOptions, ...options };
    this.toastr.success(message, title, mergedOptions);
  }

  showError(message: string, title = '¡Error!', options?: Partial<IndividualConfig>) {
    const mergedOptions = { ...this.defaultToastOptions, ...options };
    this.toastr.error(message, title, mergedOptions);
  }

  showWarning(message: string, title = 'Advertencia', options?: Partial<IndividualConfig>) {
    const mergedOptions = { ...this.defaultToastOptions, ...options };
    this.toastr.warning(message, title, mergedOptions);
  }

  showInfo(message: string, title = 'Información', options?: Partial<IndividualConfig>) {
    const mergedOptions = { ...this.defaultToastOptions, ...options };
    this.toastr.info(message, title, mergedOptions);
  }
}
