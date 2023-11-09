import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedService } from '@services/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string, remember: boolean): Observable<any> {
    return this.http.post(SharedService.host + 'JWT/JWT.php', { username, password }).pipe(
      tap((response: any) => {
        if (response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          if (remember)
            localStorage.setItem('username', username);
          else
            localStorage.removeItem('username');
          this.router.navigate(['/nav']);
        }
      })
    );
  }
}


