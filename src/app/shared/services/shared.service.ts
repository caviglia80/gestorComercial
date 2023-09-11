import { Injectable } from '@angular/core';
/* import { BehaviorSubject } from 'rxjs'; */
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Product } from '@models/product';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /*   private dataRow: any = new BehaviorSubject<any>(null); */


  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  /*   public getDataRow() {
      return this.dataRow.asObservable();
    }

    public setDataRow(valor: any) {
      this.dataRow.next(valor);
    } */




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






  public request(method: string, params: string = ''): Observable<Product[]> {
    const apiUrl = GobalVars.host + 'inventario2.php' + params;

    const requestUrl = GobalVars.proxyUrl + apiUrl; /* CORS */


    if (method === 'GET') {
      return this.http.get<Product[]>(apiUrl).pipe(
        map(response => response || []),
        catchError(error => {
          console.error(JSON.stringify(error, null, 2));
          alert('1');
          return new Observable<Product[]>;
        })
      );
    } else if (method === 'DELETE') {
      return this.http.delete<Product[]>(requestUrl).pipe(
        map(response => response || []),
        catchError(error => {
          console.error(JSON.stringify(error, null, 2));
          alert('1');
          return new Observable<Product[]>;
        })
      );
    } else if (method === 'POST') {
      return new Observable<Product[]>;
    } else {
      alert('3');
      return new Observable<Product[]>;
    }





  }




}
