import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SetJwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const publicRoutes = ['login', 'register', 'payment', 'JWT', 'empresa'];
    const isPublicRoute = publicRoutes.some(route => request.url.includes(route));
    if (isPublicRoute)
      return next.handle(request);
      const token = localStorage.getItem('jwt');

      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

    return next.handle(cloned);
  }
}
