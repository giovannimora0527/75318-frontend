// src/app/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('🔄 ErrorInterceptor ejecutándose para:', request.url);
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('🚨 Error capturado por interceptor:', error);
        console.log('Status:', error.status);
        console.log('Mensaje:', error.error?.message);
        console.log('Error completo:', error);
        
        // ✅ DETECTAR MENSAJE DE BLOQUEO ESPECÍFICO
        if (this.isBlockedAccountError(error)) {
          console.log('✅ DETECTADO: Error de cuenta bloqueada');
          const blockedMessage = error.error?.message || error.error?.error || 'Cuenta bloqueada temporalmente';
          this.showBlockedAccountAlert(blockedMessage);
          return throwError(() => new Error('BLOCKED_ACCOUNT'));
        } else {
          console.log('❌ NO es error de bloqueo');
        }

        return throwError(() => error);
      })
    );
  }

  private isBlockedAccountError(error: HttpErrorResponse): boolean {
    const message = (error.error?.message || error.error?.error || '').toLowerCase();
    console.log('🔍 Analizando mensaje:', message);
    
    // ✅ BUSCAR PALABRAS CLAVE EN EL MENSAJE
    const isBlocked = (
      message.includes('bloqueada') || 
      message.includes('bloqueado') ||
      (message.includes('temporalmente') && message.includes('minutos'))
    );
    
    console.log('¿Es error de bloqueo?', isBlocked);
    return isBlocked;
  }

  private showBlockedAccountAlert(message: string): void {
    console.log('🎯 Mostrando alerta de bloqueo:', message);
    Swal.fire({
      title: '🔒 Cuenta Bloqueada',
      html: `
        <div class="text-start">
          <p class="mb-3 fw-bold">${message}</p>
          <div class="alert alert-warning mt-3" role="alert">
            <i class="fa fa-exclamation-triangle me-2"></i>
            <strong>Por seguridad</strong>, su cuenta ha sido bloqueada temporalmente debido a múltiples intentos fallidos.
          </div>
        </div>
      `,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc107',
      width: '500px'
    });
  }
}