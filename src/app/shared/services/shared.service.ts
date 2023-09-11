import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Product } from '@models/product';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public data$: Observable<any[]> = this.dataSubject.asObservable();


  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  public copy(textToCopy: string) {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      this.message('Texto copiado !');
    } finally {
      document.body.removeChild(el);
    }
  }

  public message(text: string, action: string = 'Cerrar') {
    this.snackBar.open(text, action, {
      duration: 2500,
    });
  }












  public fetchData(params: string = '', method: string = '', proxy: boolean = false): void {
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
            this.fetchData('SELECT * FROM inventario', 'GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'POST') {
      this.http.post<any[]>(url, {})
        .subscribe({
          next: () => {
            this.fetchData('SELECT * FROM inventario', 'GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    } else if (method === 'PUT') {
      this.http.put<any[]>(url, {})
        .subscribe({
          next: () => {
            this.fetchData('SELECT * FROM inventario', 'GET');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
          }
        });
    }






  }










}
