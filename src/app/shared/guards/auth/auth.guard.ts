import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth/auth.service'; // Asegúrate de que la ruta de importación es correcta

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  if (inject(AuthService).canAccess(state.url))
    return true;

  // Redirige al usuario si no tiene acceso
  return inject(Router).parseUrl('/no-access');
};
