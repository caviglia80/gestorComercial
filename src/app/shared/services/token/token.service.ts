import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedService } from '@services/shared/shared.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  public login(username: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(SharedService.host + 'JWT/JWT.php', { username, password }).pipe(
      tap((response: any) => {
        if (response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          if (remember)
            localStorage.setItem('username', username); else
            localStorage.removeItem('username');
          this.router.navigate(['/nav']);
        }
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

      if (decoded.exp < currentTime) {
        return true; // Token expirado
      }
      return false; // Token válido y no expirado
    } catch (error) {
      return true; // Token inválido o error al decodificar
    }
  }
}
