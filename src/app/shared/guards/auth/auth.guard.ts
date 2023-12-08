import { CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.canAccess(state.url).then(acceso => {
    if (acceso) {
      return true;
    } else {
      return router.parseUrl('/no-access');
    }
  });
};
