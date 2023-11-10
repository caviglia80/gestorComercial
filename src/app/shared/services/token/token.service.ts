import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedService } from '@services/shared/shared.service';
import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
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


















  public verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(SharedService.host + 'JWT/JWTvalidate.php?action=verify', {}, { headers });
  }


}
