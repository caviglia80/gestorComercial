import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { facturacionAuth } from '@models/mainClasses/main-classes';
import { configuracion } from '@models/mainClasses/main-classes';
import { CacheService } from '@services/cache/cache.service';

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

  private ds_ReporteIngreso: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public ReporteIngreso$: Observable<any[]> = this.ds_ReporteIngreso.asObservable();

  private ds_ReporteEgresoRubro: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public ReporteEgresoRubro$: Observable<any[]> = this.ds_ReporteEgresoRubro.asObservable();

  private ds_ReporteEgresoBP: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public ReporteEgresoBP$: Observable<any[]> = this.ds_ReporteEgresoBP.asObservable();

  constructor(
    private http: HttpClient,
    public sharedService: SharedService,
    private cacheService: CacheService
  ) {
    this.Configuracion$.subscribe((data) => {
      this.currentConfiguracion = data[0];
    });
    this.fetchConfiguracion('GET');
  }

  public getCurrentConfiguracion(): configuracion {
    return this.currentConfiguracion;
  }

  /*   public getPvp(costPrice: any): number {
      const margin = (this.currentConfiguracion.margenBeneficio / 100);
      return parseFloat(costPrice) * (1 + margin);
    } */

  public fetchInventario(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/inventario.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Inventario') && method === 'GET') {
      this.ds_Inventario.next(this.cacheService.get('Inventario'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Inventario', data);
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
            this.cacheService.remove('Inventario');
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
            this.cacheService.remove('Inventario');
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
            this.cacheService.remove('Inventario');
            this.fetchInventario('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchUsuarios(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/usuarios.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Usuarios') && method === 'GET') {
      this.ds_Usuarios.next(this.cacheService.get('Usuarios'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Usuarios', data);
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
            this.cacheService.remove('Usuarios');
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
            this.cacheService.remove('Usuarios');
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
            this.cacheService.remove('Usuarios');
            this.fetchUsuarios('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchRoles(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/roles.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Roles') && method === 'GET') {
      this.ds_Roles.next(this.cacheService.get('Roles'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Roles', data);
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
            this.cacheService.remove('Roles');
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
            this.cacheService.remove('Roles');
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
            this.cacheService.remove('Roles');
            this.fetchRoles('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchProveedores(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/proveedores.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Proveedores') && method === 'GET') {
      this.ds_Proveedores.next(this.cacheService.get('Proveedores'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Proveedores', data);
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
            this.cacheService.remove('Proveedores');
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
            this.cacheService.remove('Proveedores');
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
            this.cacheService.remove('Proveedores');
            this.fetchProveedores('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchIngresos(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/ingresos.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Ingresos') && method === 'GET') {
      this.ds_Ingresos.next(this.cacheService.get('Ingresos'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Ingresos', data);
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
            this.cacheService.remove('Ingresos');
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
            this.cacheService.remove('Ingresos');
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
            this.cacheService.remove('Ingresos');
            this.fetchIngresos('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchEgresos(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/egresos.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Egresos') && method === 'GET') {
      this.ds_Egresos.next(this.cacheService.get('Egresos'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Egresos', data);
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
            this.cacheService.remove('Egresos');
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
            this.cacheService.remove('Egresos');
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
            this.cacheService.remove('Egresos');
            this.fetchEgresos('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchFacturacionAuth(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/facturacionAuth.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('FacturacionAuth') && method === 'GET') {
      this.ds_FacturacionAuth.next(this.cacheService.get('FacturacionAuth'));
      return;
    }

    if (method === 'GET') {
      this.http.get<facturacionAuth[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('FacturacionAuth', data);
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
            this.cacheService.remove('FacturacionAuth');
            this.fetchFacturacionAuth('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchConfiguracion(method = '', body: any = {}, proxy = false): void {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/configuracion.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Configuracion') && method === 'GET') {
      this.ds_Configuracion.next(this.cacheService.get('Configuracion'));
      return;
    }

    if (method === 'GET') {
      this.http.get<any[]>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Configuracion', data);
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
            this.cacheService.remove('Configuracion');
            this.fetchConfiguracion('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar editar el registro.');
          }
        });
    }
    if (!SharedService.isProduction) console.log(method);
  }

  public fetchReporteIngreso(params: string, proxy = false): void {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('ReporteIngreso')) {
      this.ds_ReporteIngreso.next(this.cacheService.get('ReporteIngreso'));
      return;
    }

    this.http.get<any[]>(url)
      .subscribe({
        next: (data) => {
          this.cacheService.set('ReporteIngreso', data);
          this.ds_ReporteIngreso.next(data);
        },
        error: (error) => {
          if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
          this.sharedService.message('Error al intentar obtener registros.');
        }
      });
    if (!SharedService.isProduction) console.log('GET');
  }

  public fetchReporteEgresoRubro(params: string, proxy = false): void {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('ReporteEgresoRubro')) {
      this.ds_ReporteEgresoRubro.next(this.cacheService.get('ReporteEgresoRubro'));
      return;
    }

    this.http.get<any[]>(url)
      .subscribe({
        next: (data) => {
          this.cacheService.set('ReporteEgresoRubro', data);
          this.ds_ReporteEgresoRubro.next(data);
        },
        error: (error) => {
          if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
          this.sharedService.message('Error al intentar obtener registros.');
        }
      });
    if (!SharedService.isProduction) console.log('GET');
  }

  public fetchReporteEgresoBP(params: string, proxy = false): void {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('ReporteEgresoBP')) {
      this.ds_ReporteEgresoBP.next(this.cacheService.get('ReporteEgresoBP'));
      return;
    }

    this.http.get<any[]>(url)
      .subscribe({
        next: (data) => {
          this.cacheService.set('ReporteEgresoBP', data);
          this.ds_ReporteEgresoBP.next(data);
        },
        error: (error) => {
          if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
          this.sharedService.message('Error al intentar obtener registros.');
        }
      });
    if (!SharedService.isProduction) console.log('GET');
  }
}
