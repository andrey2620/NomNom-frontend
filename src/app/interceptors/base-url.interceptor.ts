import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Si la URL ya es absoluta, no se modifica
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const base: string = environment.apiUrl;
  const clonedRequest = req.clone({
    url: `${base}/${req.url}`,
    setHeaders: {
      Accept: 'application/json',
    },
  });

  return next(clonedRequest);
};
