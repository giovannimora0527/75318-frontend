import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as string[];

  if (roles && !roles.includes(auth.getRole())) {
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
