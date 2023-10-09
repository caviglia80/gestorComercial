import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { facturacionAuth } from '@models/mainClasses/main-classes';
import { configuracion } from '@models/mainClasses/main-classes';
import { Product } from '@models/mainClasses/main-classes';

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

  private ds_FacturacionAuth: BehaviorSubject<facturacionAuth[]> = new BehaviorSubject<facturacionAuth[]>([]);
  public FacturacionAuth$: Observable<facturacionAuth[]> = this.ds_FacturacionAuth.asObservable();

  private ds_Configuracion: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public Configuracion$: Observable<any[]> = this.ds_Configuracion.asObservable();
  private currentConfiguracion: any;

  private ds_reportesIngresos: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public reportesIngresos$: Observable<any[]> = this.ds_reportesIngresos.asObservable();

  private ds_reportesEgresosRubro: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public reportesEgresosRubro$: Observable<any[]> = this.ds_reportesEgresosRubro.asObservable();

  private ds_reportesEgresosBP: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public reportesEgresosBP$: Observable<any[]> = this.ds_reportesEgresosBP.asObservable();

  constructor(
    private http: HttpClient,
    public sharedService: SharedService
  ) {
    this.Configuracion$.subscribe((data) => {
      this.currentConfiguracion = data[0];
    });
    this.fetchConfiguracion('GET');
  }

  public getCurrentConfiguracion(): configuracion {
    return this.currentConfiguracion;
  }

  public getPvp(costPrice: any): number {
    const margin = (this.currentConfiguracion.pvpPorcentaje / 100);
    return parseFloat(costPrice) * (1 + margin);
  }

  public fetchInventario(method: string = '', body: any = {}, proxy: boolean = false): void {
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/inventario.php';
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
            this.sharedService.message('Inventario: registro eliminado.');
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
            this.sharedService.message('Inventario: registro guardado.');
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
            this.sharedService.message('Inventario: registro actualizado.');
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
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/usuarios.php';
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
            this.sharedService.message('Usuarios: registro eliminado.');
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
            this.sharedService.message('Usuarios: registro guardado.');
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
            this.sharedService.message('Usuarios: registro actualizado.');
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
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/roles.php';
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
            this.sharedService.message('Roles: registro eliminado.');
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
            this.sharedService.message('Roles: registro guardado.');
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
            this.sharedService.message('Roles: registro actualizado.');
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
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/proveedores.php';
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
            this.sharedService.message('Proveedores: registro eliminado.');
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
            this.sharedService.message('Proveedores: registro guardado.');
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
            this.sharedService.message('Proveedores: registro actualizado.');
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
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/ingresos.php';
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
            this.sharedService.message('Ingresos: registro eliminado.');
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
            this.sharedService.message('Ingresos: registro guardado.');
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
            this.sharedService.message('Ingresos: registro actualizado.');
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
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/egresos.php';
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
            this.sharedService.message('Egresos: registro eliminado.');
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
            this.sharedService.message('Egresos: registro guardado.');
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
            this.sharedService.message('Egresos: registro actualizado.');
            this.fetchEgresos('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchFacturacionAuth(method: string = '', body: any = {}, proxy: boolean = false): void {
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/facturacionAuth.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<facturacionAuth[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_FacturacionAuth.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar obtener registros.');
          }
        });
    } else if (method === 'PUT') {
      this.http.put<any[]>(url, body, headers)
        .subscribe({
          next: () => {
            this.sharedService.message('Facturacion: registro actualizado.');
            this.fetchFacturacionAuth('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchConfiguracion(method: string = '', body: any = {}, proxy: boolean = false): void {
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/configuracion.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.ds_Configuracion.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar obtener registros.');
          }
        });
    } else if (method === 'PUT') {
      this.http.put(url, body, headers)
        .subscribe({
          next: () => {
            this.sharedService.message('Configuración actualizada !');
            this.fetchConfiguracion('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
  }

  public fetchReportes(method: string = '', params: string, tipo: string, proxy: boolean = false): void {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;
    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            if (tipo === 'ingresos')
              this.ds_reportesIngresos.next(data);
            else if (tipo === 'reportesEgresosRubro')
              this.ds_reportesEgresosRubro.next(data);
            else if (tipo === 'reportesEgresosBP')
              this.ds_reportesEgresosBP.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar obtener registros.');
          }
        });
    }
  }





}
