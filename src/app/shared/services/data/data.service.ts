import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject_Inventario: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public data_Inventario$: Observable<any[]> = this.dataSubject_Inventario.asObservable();

  constructor(
    private http: HttpClient,
    public sharedService: SharedService
  ) { }

  public fetchInventario_safe(method: string = '', body: any = {}, proxy: boolean = false): void {
    const NAME: any = body.name;
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!SharedService.isProduction) console.log(body);
    let url = SharedService.host + 'inventario.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.dataSubject_Inventario.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar obtener registros.');
          }
        });
    } else if (method === 'DELETE') {
      this.http.delete<any[]>(url, { body: body })
        .subscribe({
          next: () => {
            this.sharedService.message(NAME ? 'Eliminado: ' + NAME : 'Registro eliminado.');
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar borrar el registro.');
          }
        });
    } else if (method === 'POST') {
      this.http.post<any[]>(url, body, headers)
        .subscribe({
          next: () => {
            this.sharedService.message(NAME ? 'Guardado: ' + NAME : 'Registro guardado.');
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar guardar el registro.');
          }
        });
    } else if (method === 'PUT') {
      this.http.put<any[]>(url, body, headers)
        .subscribe({
          next: () => {
            this.sharedService.message(NAME ? 'Editado: ' + NAME : 'Registro editado.');
            this.fetchInventario_safe('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }
















}
