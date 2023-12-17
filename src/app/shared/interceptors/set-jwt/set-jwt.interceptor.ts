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

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const publicRoutes = ['login', 'register'];
    const isPublicRoute = publicRoutes.some(route => request.url.includes(route));
    if (isPublicRoute)
      return next.handle(request);

    const cloned = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem('jwt')}`)
    });

    return next.handle(cloned);
  }
}
