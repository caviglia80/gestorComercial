import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ds_Inventario: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Inventario$: Observable<any[]> = this.ds_Inventario.asObservable();

  private ds_Usuarios: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Usuarios$: Observable<any[]> = this.ds_Usuarios.asObservable();

  private ds_Roles: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Roles$: Observable<any[]> = this.ds_Roles.asObservable();

  private ds_Proveedores: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Proveedores$: Observable<any[]> = this.ds_Proveedores.asObservable();

  private ds_Ingresos: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Ingresos$: Observable<any[]> = this.ds_Ingresos.asObservable();

  private ds_Egresos: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Egresos$: Observable<any[]> = this.ds_Egresos.asObservable();


  constructor(
    private http: HttpClient,
    public sharedService: SharedService
  ) { }


  public fetchInventario(method: string = '', body: any = {}, proxy: boolean = false): void {
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
            this.ds_Inventario.next(data);
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
            this.fetchInventario('GET');
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
            this.fetchInventario('GET');
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
            this.fetchInventario('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchUsuarios(method: string = '', body: any = {}, proxy: boolean = false): void {
    const NAME: any = body.name;
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!SharedService.isProduction) console.log(body);
    let url = SharedService.host + 'usuarios.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_Usuarios.next(data);
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
            this.fetchUsuarios('GET');
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
            this.fetchUsuarios('GET');
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
            this.fetchUsuarios('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchRoles(method: string = '', body: any = {}, proxy: boolean = false): void {
    const NAME: any = body.name;
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!SharedService.isProduction) console.log(body);
    let url = SharedService.host + 'roles.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_Roles.next(data);
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
            this.fetchRoles('GET');
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
            this.fetchRoles('GET');
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
            this.fetchRoles('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchProveedores(method: string = '', body: any = {}, proxy: boolean = false): void {
    const NAME: any = body.name;
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!SharedService.isProduction) console.log(body);
    let url = SharedService.host + 'proveedores.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_Proveedores.next(data);
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
            this.fetchProveedores('GET');
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
            this.fetchProveedores('GET');
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
            this.fetchProveedores('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchIngresos(method: string = '', body: any = {}, proxy: boolean = false): void {
    const NAME: any = body.name;
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!SharedService.isProduction) console.log(body);
    let url = SharedService.host + 'ingresos.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_Ingresos.next(data);
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
            this.fetchIngresos('GET');
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
            this.fetchIngresos('GET');
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
            this.fetchIngresos('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchEgresos(method: string = '', body: any = {}, proxy: boolean = false): void {
    const NAME: any = body.name;
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    if (!SharedService.isProduction) console.log(body);
    let url = SharedService.host + 'egresos.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_Egresos.next(data);
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
            this.fetchEgresos('GET');
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
            this.fetchEgresos('GET');
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
            this.fetchEgresos('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }






















}
