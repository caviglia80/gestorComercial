import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public data$: Observable<any[]> = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  /* public fetchInventario( method: string = '',params: string = '', proxy: boolean = false): void {
    let url = GobalVars.host + 'inventario.php?q=' + encodeURIComponent(params);
    if (proxy) url = GobalVars.proxyUrl + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.dataSubject.next(data);
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'DELETE') {
      this.http.delete<any[]>(url)
        .subscribe({
          next: () => {
            this.fetchInventario('SELECT * FROM inventario', 'GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'POST') {
      this.http.post<any[]>(url, {})
        .subscribe({
          next: () => {
            this.fetchInventario('SELECT * FROM inventario', 'GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'PUT') {
      this.http.put<any[]>(url, {})
        .subscribe({
          next: () => {
            this.fetchInventario('SELECT * FROM inventario', 'GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    }
  } */

  public fetchInventario_safe(method: string = '', params: string = '', proxy: boolean = false): void {
    let url = GobalVars.host + 'inventario2.php' + params;
    if (proxy) url = GobalVars.proxyUrl + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.dataSubject.next(data);
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'DELETE') {
      this.http.delete<any[]>(url)
        .subscribe({
          next: () => {
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'POST') {
      this.http.post<any[]>(url, {})
        .subscribe({
          next: () => {
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'PUT') {
      this.http.put<any[]>(url, {})
        .subscribe({
          next: () => {
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    }
  }
















}
