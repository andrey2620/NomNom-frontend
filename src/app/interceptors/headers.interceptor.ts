import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('google.com') || req.url.includes('googleapis.com')) {
    return next(req);
  }
  // Clone the request and add the headers
  const modifiedRequest = req.clone({
    setHeaders: {
      accept: 'application/json, text/plain, */*',
      'bypass-tunnel-reminder': 'true',
    },
  });

  // Pass the modified request to the next handler
  return next(modifiedRequest);
};
