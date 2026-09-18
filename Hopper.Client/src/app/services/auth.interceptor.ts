import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('sessionToken');
  const auth = inject(AuthService);
  return next(request.clone({
    withCredentials: true,
    ...(token ? { setHeaders: { Authorization: `Bearer ${token}` } } : {})
  })).pipe(catchError(error => {
    if (error.status === 401 && token) auth.clearLocalSession();
    return throwError(() => error);
  }));
};
