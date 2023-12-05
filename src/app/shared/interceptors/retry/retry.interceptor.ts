import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, switchMap, take, debounceTime } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  maxRetryAttempts = 3; // Define el número máximo de reintentos
  retryAttempts = 0; // Contador de reintentos
  resetInterval = 30000; // Define el intervalo de reinicio en milisegundos (30 segundos)
  private resetSubject = new BehaviorSubject<null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);







  }

  constructor() {
    // Cada 30 segundos, reinicia retryAttempts a 0
    this.resetSubject.pipe(debounceTime(this.resetInterval)).subscribe(() => {
      this.resetRetryAttempts();
    });
  }

  resetRetryAttempts() {
    this.retryAttempts = 0;
  }
}
