import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public fetchInventario_safe(method: string = '', body: any = {}, proxy: boolean = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!environment.production) console.log(body);
    let url = GobalVars.host + 'inventario.php';
    if (proxy) url = GobalVars.proxyUrl + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.dataSubject.next(data);
          },
          error: (error) => {
            if (!environment.production) console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'DELETE') {
      this.http.delete<any[]>(url, { body: body })
        .subscribe({
          next: () => {
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            if (!environment.production) console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'POST') {
      this.http.post<any[]>(url, body, headers)
        .subscribe({
          next: () => {
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            if (!environment.production) console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'PUT') {
      this.http.put<any[]>(url, body, headers)
        .subscribe({
          next: () => {
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            if (!environment.production) console.error(JSON.stringify(error, null, 2));
          }
        });
    }
  }
















}
