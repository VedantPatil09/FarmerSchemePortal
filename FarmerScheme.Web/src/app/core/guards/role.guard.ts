import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const currentRole = authService.userRole();
    if (currentRole && allowedRoles.includes(currentRole)) {
      return true;
    }

    // Redirect to home if user does not possess required role
    router.navigate(['/']);
    return false;
  };
};
