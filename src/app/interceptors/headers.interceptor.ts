import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    try {
      console.log('HeadersInterceptor: token present=', !!token);
    } catch (e) {}
    let headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const clonedRequest = req.clone({ setHeaders: headers });
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Ir al login'
          }).then(() => {
            localStorage.removeItem('token');
            window.location.href = '/#/login';
          });
        }
        if (error.status === 403) {
          Swal.fire({
            title: 'Acceso denegado',
            text: 'No tiene permisos para realizar esta acción.',
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        }
        return throwError(() => error);
      })
    );
  }
}