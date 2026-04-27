import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.verifyAuth().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.verifyAuth().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};
