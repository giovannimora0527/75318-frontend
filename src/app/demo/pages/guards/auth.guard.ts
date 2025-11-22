import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as Array<string>;
  if (roles && roles.length > 0 && !roles.includes(authService.getRole())) {
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
