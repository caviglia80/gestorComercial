import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@services/shared/shared.service';
import { Role } from '@models/mainClasses/main-classes';
import { firstValueFrom } from 'rxjs';

interface Menu {
  ruta: string;
  nombre: string;
  habilitado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private menus: Menu[];

  constructor(
    private http: HttpClient,
    public sharedService: SharedService
  ) {
    this.menus = [
    //  { "ruta": "/nav/dashboard", "nombre": "Panel", "habilitado": false },
    //  { "ruta": "/nav/ingresos", "nombre": "Ingresos", "habilitado": false },
    //  { "ruta": "/nav/egresos", "nombre": "Egresos", "habilitado": false },
    //  { "ruta": "/nav/inventario", "nombre": "Inventario", "habilitado": false },
    //  { "ruta": "/nav/proveedores", "nombre": "Proveedores", "habilitado": false },
    //  { "ruta": "/nav/reportes", "nombre": "Reportes", "habilitado": false },
    //  { "ruta": "/nav/general", "nombre": "General", "habilitado": false },
    //  { "ruta": "/nav/usuarios", "nombre": "Usuarios", "habilitado": false },
    //  { "ruta": "/nav/roles", "nombre": "Roles", "habilitado": false }
    ];
  }

  canAccess(ruta: string): boolean {
    return this.menus.some(menu => menu.ruta === ruta && menu.habilitado);
  }

  getFirstEnabledRoute(): string {
    const firstEnabledMenu = this.menus.find(menu => menu.habilitado);
    return firstEnabledMenu ? firstEnabledMenu.ruta : '/nav/inicio';
  }

  availableMenus(): boolean {
    return this.menus.length > 0;
  }

  // fetchRol(): void {
  //   this.http.get<Role>(SharedService.host + 'DB/guard.php')
  //     .subscribe({
  //       next: (data) => {
  //         this.menus = JSON.parse(data.menus);
  //       },
  //       error: (error) => {
  //         if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
  //         this.menus = [];
  //         this.sharedService.message('Error al intentar obtener registros.');
  //       }
  //     });
  // }

  fetchRol(): Promise<Menu[]> {
    return firstValueFrom(this.http.get<Role>(SharedService.host + 'DB/guard.php'))
      .then((data) => {
        this.menus = JSON.parse(data ? data.menus : '[]');
        return this.menus;
      })
      .catch((error) => {
        if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
        this.sharedService.message('Error al intentar obtener registros.');
        throw error;
      });
  }
}
