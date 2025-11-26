import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const rol = localStorage.getItem('rol');
    const allowedRoles = route.data['roles'] as string[];
    if (!rol || !allowedRoles.includes(rol)) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
