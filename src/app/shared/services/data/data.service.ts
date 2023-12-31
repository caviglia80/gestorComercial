import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { CacheService } from '@services/cache/cache.service';
import { Inventario } from '@models/mainClasses/main-classes';
import { RequestCancelService } from '@services/requestCancel/request-cancel.service';
import { takeUntil } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ds_Inventario: BehaviorSubject<Inventario[]> = new BehaviorSubject<Inventario[]>([]);
  public Inventario$: Observable<Inventario[]> = this.ds_Inventario.asObservable();

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

  private ds_Empresa: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public Empresa$: Observable<any> = this.ds_Empresa.asObservable();

  private ds_ReporteIngreso: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public ReporteIngreso$: Observable<any[]> = this.ds_ReporteIngreso.asObservable();

  private ds_ReporteEgresoRubro: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public ReporteEgresoRubro$: Observable<any[]> = this.ds_ReporteEgresoRubro.asObservable();

  private ds_ReporteEgresoBP: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public ReporteEgresoBP$: Observable<any[]> = this.ds_ReporteEgresoBP.asObservable();

  // private ds_Remito: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // public Remito$: Observable<any[]> = this.ds_Remito.asObservable();

  private ds_Sa: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public Sa$: Observable<any> = this.ds_Sa.asObservable();

  constructor(
    private http: HttpClient,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private cancelService: RequestCancelService
  ) {
  }

  public async fetchInventario(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/inventario.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Inventario') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Inventario.next(this.cacheService.get('Inventario'));
      return;
    }
    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}`);

    if (method === 'GET') {
      try {
        const response = await firstValueFrom(this.http.get<any[]>(url).pipe(takeUntil(cancelToken)));
        this.cacheService.set('Inventario', response);
        this.ds_Inventario.next(response);
        return response;
      } catch (errorResponse: any) {
        this.ds_Inventario.next([]);
        this.sharedService.message('Empresa: Error al intentar obtener registros.');
        const response: any = {};
        response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    } else if (method === 'DELETE') {
      return await this.http.delete<any[]>(url, { body: body })
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
      return await this.http.post<any[]>(url, body, headers)
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
      return await this.http.put<any[]>(url, body, headers)
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
    return;
  }

  public async fetchUsuarios(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/usuarios.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Usuarios') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Usuarios.next(this.cacheService.get('Usuarios'));
      return;
    }
    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}`);

    if (method === 'GET') {
      return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
        .subscribe({
          next: (data) => {
            this.cacheService.set('Usuarios', data);
            this.ds_Usuarios.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.ds_Usuarios.next([]);
            this.sharedService.message('Error al intentar obtener registros.');
          }
        });
    } else if (method === 'DELETE') {
      return await this.http.delete<any[]>(url, { body: body })
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
      try {
        const response = await firstValueFrom(this.http.post<any>(url, body, headers));
        if (!SharedService.isProduction) console.log(response);
        this.sharedService.message('Usuarios: registro guardado.');
        if (!JSON.parse(body).administrador) {
          this.cacheService.remove('Usuarios');
          this.fetchUsuarios('GET');
        }
        return response;
      } catch (errorResponse: any) {
        this.sharedService.message('Error al intentar guardar registro.');
        const response: any = {};
        if (errorResponse.status === 400)
          response.message = errorResponse.error.message || 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        else
          response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    } else if (method === 'PUT') {
      try {
        const response = await firstValueFrom(this.http.put<any>(url, body, headers));
        if (!SharedService.isProduction) console.log(response);
        this.sharedService.message('Usuarios: registro actualizado.');
        this.cacheService.remove('Usuarios');
        this.fetchUsuarios('GET');
        return response;
      } catch (errorResponse: any) {
        this.sharedService.message('Error al intentar editar el registro.');
        const response: any = {};
        if (errorResponse.status === 400)
          response.message = errorResponse.error.message || 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        else
          response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    }
    return;
  }

  public async fetchNewAdmin(method = '', body: any = {}) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/newAdmin.php';

    if (method === 'POST') {
      try {
        const response = await firstValueFrom(this.http.post<any>(url, body, headers));
        if (!SharedService.isProduction) console.log(response);
        return response;
      } catch (errorResponse: any) {
        if (!SharedService.isProduction) console.log(errorResponse);
        this.sharedService.message('Error al intentar guardar registro.');
        const response: any = {};
        if (errorResponse.status === 400)
          response.message = errorResponse.error.message || 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        else
          response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    }
    return;
  }

  public async fetchRoles(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/roles.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Roles') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Roles.next(this.cacheService.get('Roles'));
      return;
    }

    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}`);

    if (method === 'GET') {
      return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
        .subscribe({
          next: (data) => {
            this.cacheService.set('Roles', data);
            this.ds_Roles.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.ds_Roles.next([]);
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
    return;
  }

  public async fetchProveedores(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/proveedores.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Proveedores') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Proveedores.next(this.cacheService.get('Proveedores'));
      return;
    }

    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}`);

    if (method === 'GET') {
      return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
        .subscribe({
          next: (data) => {
            this.cacheService.set('Proveedores', data);
            this.ds_Proveedores.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.ds_Proveedores.next([]);
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
    return;
  }

  public async fetchIngresos(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/ingresos.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Ingresos') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Ingresos.next(this.cacheService.get('Ingresos'));
      return;
    }

    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}`);

    if (method === 'GET') {
      return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
        .subscribe({
          next: (data) => {
            this.cacheService.set('Ingresos', data);
            this.ds_Ingresos.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.ds_Ingresos.next([]);
            this.sharedService.message('Error al intentar obtener registros.');
          }
        });
    } else if (method === 'DELETE') {
      try {
        const response = await firstValueFrom(this.http.delete<any[]>(url, { body: body }));
        this.sharedService.message('Ingresos: registro eliminado.');
        this.cacheService.remove('Ingresos');
        this.fetchIngresos('GET');
        return response;
      } catch (errorResponse: any) {
        this.sharedService.message('Error al intentar eliminar registro.');
        const response: any = {};
        response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    } else if (method === 'POST') {
      const response = await firstValueFrom(this.http.post<any>(url, body, headers));
      if (!SharedService.isProduction) console.log(response);
      this.sharedService.message('Ingresos: registro guardado.');
      this.cacheService.remove('Ingresos');
      this.fetchIngresos('GET');
      return response;
    } else if (method === 'PUT') {
      try {
        const response = await firstValueFrom(this.http.put<any>(url, body, headers));
        this.sharedService.message('Ingresos: registro actualizado.');
        this.cacheService.remove('Ingresos');
        this.fetchIngresos('GET');
        return response;
      } catch (errorResponse: any) {
        this.sharedService.message('Error al intentar editar el registro.');
        const response: any = {};
        response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    }
    return;
  }

  public async fetchEgresos(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/egresos.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Egresos') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Egresos.next(this.cacheService.get('Egresos'));
      return;
    }

    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}`);

    if (method === 'GET') {
      return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
        .subscribe({
          next: (data) => {
            this.cacheService.set('Egresos', data);
            this.ds_Egresos.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.ds_Egresos.next([]);
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
    return;
  }

  /*  public fetchFacturacionAuth(method = '', body: any = {}, proxy = false): void {
     body = JSON.stringify(body);
     const headers: {} = { 'Content-Type': 'application/json' }
     let url = SharedService.host + 'DB/facturacionAuth.php';
     if (proxy) url = SharedService.proxy + url;

     if (this.cacheService.has('FacturacionAuth') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
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
     if (!SharedService.isProduction) console.log(method + ' - Solicitud');
   } */

  public async fetchEmpresa(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/empresa.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Empresa') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Empresa.next(this.cacheService.get('Empresa'));
      return this.cacheService.get('Empresa');
    }

    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}-${method}-${body.length}-DS`);

    if (method === 'GET') {
      try {
        const response = await firstValueFrom(this.http.get<any[]>(url).pipe(takeUntil(cancelToken)));
        this.cacheService.set('Empresa', response[0]);
        this.ds_Empresa.next(response[0]);
        return response[0];
      } catch (errorResponse: any) {
        this.ds_Empresa.next(null);
        this.sharedService.message('Empresa: Error al intentar obtener registros.');
        const response: any = {};
        response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    } else if (method === 'POST') {
      return await this.http.post<any>(url, body, headers)
        .subscribe({
          next: (data) => {
            this.sharedService.message('Configuración actualizada !');
            this.cacheService.remove('Empresa');
            if (!data.empresaId) this.fetchEmpresa('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Empresa: Error al intentar guardar el registro.');
          }
        });
    } else if (method === 'PUT') {
      try {
        const response = await firstValueFrom(this.http.put<any>(url, body, headers));
        this.sharedService.message('Configuración actualizada !');
        this.cacheService.remove('Empresa');
        this.fetchEmpresa('GET');
        return response[0];
      } catch (errorResponse: any) {
        this.ds_Empresa.next(null);
        this.sharedService.message('Empresa: Error al intentar editar el registro.');
        const response: any = {};
        response.message = 'Ocurrio un error, intente nuevamente mas tarde o contacte con soporte.';
        return response;
      }
    }
    return;
  }

  public async fetchSa(method = '', body: any = {}, proxy = false) {
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'DB/sa.php';
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('Sa') && method === 'GET') {
      if (!SharedService.isProduction) console.log(method + ' - Cache');
      this.ds_Sa.next(this.cacheService.get('Sa'));
      return;
    }

    if (!SharedService.isProduction) console.log(method + ' - Solicitud');

    if (method === 'GET') {
      this.http.get<any>(url)
        .subscribe({
          next: (data) => {
            this.cacheService.set('Sa', data);
            this.ds_Sa.next(data);
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.ds_Sa.next(null);
            this.sharedService.message('Sa: Error al intentar obtener registros.');
          }
        });
    } else if (method === 'POST') {
      this.http.post<any>(url, body, headers)
        .subscribe({
          next: (data) => {
            this.sharedService.message('Configuración actualizada !');
            this.cacheService.remove('Sa');
            this.fetchSa('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Sa: Error al intentar guardar el registro.');
          }
        });
    } else if (method === 'PUT') {
      this.http.put(url, body, headers)
        .subscribe({
          next: () => {
            this.sharedService.message('Configuración actualizada !');
            this.cacheService.remove('Sa');
            this.fetchSa('GET');
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Sa: Error al intentar editar el registro.');
          }
        });
    }
    return;
  }

  public async fetchReporteIngreso(params: string, proxy = false) {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('ReporteIngreso')) {
      if (!SharedService.isProduction) console.log('GET - Cache');
      this.ds_ReporteIngreso.next(this.cacheService.get('ReporteIngreso'));
      return;
    }

    if (!SharedService.isProduction) console.log('GET' + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}`);

    return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
      .subscribe({
        next: (data) => {
          this.cacheService.set('ReporteIngreso', data);
          this.ds_ReporteIngreso.next(data);
        },
        error: (error) => {
          if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
          this.ds_ReporteIngreso.next([]);
          this.sharedService.message('Error al intentar obtener registros.');
        }
      });
  }

  public async fetchReporteEgresoRubro(params: string, proxy = false) {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('ReporteEgresoRubro')) {
      if (!SharedService.isProduction) console.log('GET - Cache');
      this.ds_ReporteEgresoRubro.next(this.cacheService.get('ReporteEgresoRubro'));
      return;
    }

    if (!SharedService.isProduction) console.log('GET' + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}`);

    return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
      .subscribe({
        next: (data) => {
          this.cacheService.set('ReporteEgresoRubro', data);
          this.ds_ReporteEgresoRubro.next(data);
        },
        error: (error) => {
          if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
          this.ds_ReporteEgresoRubro.next([]);
          this.sharedService.message('Error al intentar obtener registros.');
        }
      });
  }

  public async fetchReporteEgresoBP(params: string, proxy = false) {
    let url = SharedService.host + 'DB/reportes.php' + params;
    if (proxy) url = SharedService.proxy + url;

    // Verificar si los datos están en caché
    if (this.cacheService.has('ReporteEgresoBP')) {
      if (!SharedService.isProduction) console.log('GET - Cache');
      this.ds_ReporteEgresoBP.next(this.cacheService.get('ReporteEgresoBP'));
      return;
    }

    if (!SharedService.isProduction) console.log('GET' + ' - Solicitud');

    const cancelToken = this.cancelService.onNewRequest(`${url}`);

    return await this.http.get<any[]>(url).pipe(takeUntil(cancelToken))
      .subscribe({
        next: (data) => {
          this.cacheService.set('ReporteEgresoBP', data);
          this.ds_ReporteEgresoBP.next(data);
        },
        error: (error) => {
          if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
          this.ds_ReporteEgresoBP.next([]);
          this.sharedService.message('Error al intentar obtener registros.');
        }
      });
  }
}
