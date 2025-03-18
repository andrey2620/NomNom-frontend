import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.warn("No hay token, redirigiendo a login...");
    router.navigate(['/login']);
    return false;
  }

  return true;
};
