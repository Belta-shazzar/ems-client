import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { EmployeeRole } from '../models/auth.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Check for required roles
    const requiredRoles = route.data['roles'] as EmployeeRole[];
    if (requiredRoles && !authService.hasRole(requiredRoles)) {
      router.navigate(['./dashboard']);
      return false;
    }

    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
