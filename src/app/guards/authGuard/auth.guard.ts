import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { ToastService } from '../../services/toast-service/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if(authService.isLoggedIn) {
    return true;
  }

  toastService.show('Please log in to access this page', 3000, false);
  router.navigate(['/login']);

  return true;
};
