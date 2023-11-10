import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '@services/token/token.service';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class CheckJwtInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const publicRoutes = ['login', 'register', 'payment', 'JWT', 'configuracion'];
    const isPublicRoute = publicRoutes.some(route => request.url.includes(route));
    if (isPublicRoute)
      return next.handle(request);

    const token = localStorage.getItem('jwt');

    if (!token || token.split('.').length !== 3) {
      this.tokenService.logout();
      return throwError(new Error('Token inválido'));
    }

    if (!token || token.split('.').length !== 3 || this.isExpired(token)) {
      // Si el token ha expirado
      this.tokenService.logout(); // Cierra la sesión
      return throwError(new Error('Token expirado'));
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Si el token es inválido o ha expirado
          this.tokenService.logout(); // Cierra la sesión
        }
        return throwError(error);
      })
    );
  }

  private isExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos

      if (decoded.exp < currentTime) {
        return true; // Token expirado
      }
      return false; // Token válido y no expirado
    } catch (error) {
      return true; // Token inválido o error al decodificar
    }
  }
}
