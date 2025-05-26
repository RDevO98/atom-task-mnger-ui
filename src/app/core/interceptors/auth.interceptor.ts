import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../../features/login/infrastructure/services/auth.service';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const _authService = inject(AuthService);
  const token = _authService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next(clonedRequest).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error('Unauthorized request:', err);
          } else {
            console.error('HTTP error:', err);
          }
        } else {
          console.error('An error occurred:', err);
        }

        return throwError(() => err);
      })
    );
  } else {
    return next(req);
  }
};
