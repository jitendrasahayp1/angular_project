import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);

  // Only attach Authorization header for API requests
  if (req.url.startsWith(environment.api)) {
    const token = jwtService.get();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        jwtService.destroy();
        window.location.reload();
      }
      return throwError(() => error);
    })
  );
};
