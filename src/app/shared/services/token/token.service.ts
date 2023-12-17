import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SharedService } from '@services/shared/shared.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { switchMap, catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  public login(email: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(SharedService.host + 'JWT/JWT.php', { email, password }).pipe(
      tap((response: any) => {
        if (response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          if (remember) {
            localStorage.setItem('email', email);
          } else {
            localStorage.removeItem('email');
          }
        }
      }),
      switchMap((response: any) => {
        if (!response.jwt) {
          return of(response); // Si no hay JWT, simplemente devuelve la respuesta tal cual.
        }
        return this.authService.refreshUserInfo().then(() => {
          response.rolValido = this.authService.availableMenus();
          const firstRoute = this.authService.getFirstEnabledRoute();
          this.router.navigate([firstRoute]);
          return response;
        }).catch(() => {
          this.logout();
          response.rolValido = this.authService.availableMenus();
          return response;
        });
      }),
      catchError((error) => {
        return of({ error: true, message: error.message });
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  public isExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos

      if (decoded.exp < currentTime)
        return true; // Token expirado

      return false; // Token válido y no expirado
    } catch (error) {
      return true; // Token inválido o error al decodificar
    }
  }
}
