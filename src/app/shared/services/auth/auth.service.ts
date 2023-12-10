import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@services/shared/shared.service';
import { firstValueFrom, tap, switchMap, of } from 'rxjs';
import { DataService } from '@services/data/data.service';
import { jwtDecode } from 'jwt-decode';
interface Menu {
  ruta: string;
  nombre: string;
  habilitado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private menus: Menu[];
  private isAdmin: boolean = false;
  private currentRolName: string = '';
  private userId: string = '';
  private username: string = '';

  constructor(
    private http: HttpClient,
    public dataService: DataService,
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

  async canAccess(ruta: string): Promise<boolean> {
    if (this.isAdmin) return true;
    if (this.menus.length === 0)
      await this.fetchRol();
    return this.menus.some(menu => menu.ruta === ruta && menu.habilitado);
  }

  async getRolName(): Promise<string> {
    return this.currentRolName;
  }

  getFirstEnabledRoute(): string {
    if (this.isAdmin) return '/nav/dashboard';
    const firstEnabledMenu = this.menus.find(menu => menu.habilitado);
    return firstEnabledMenu ? firstEnabledMenu.ruta : '/nav/inicio';
  }

  availableMenus(): boolean {
    if (this.isAdmin) return true;
    return this.menus.length > 0;
  }

  fetchRol(): Promise<Menu[]> {
    this.menus = [];
    return firstValueFrom(this.http.get<any>(SharedService.host + 'DB/guard.php'))
      .then((data) => {
        if (data.isAdmin) {
          this.isAdmin = true;
          return [];
        }
        this.menus = JSON.parse(data ? data.menus : '[]');
        this.currentRolName = data.nombre || '';
        return this.menus;
      })
      .catch((error) => {
        if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
        this.sharedService.message('Error al intentar obtener registros.');
        throw error;
      });
  }

  async getUsername(): Promise<string> {
    return firstValueFrom(this.http.get<any>(SharedService.host + 'DB/varios.php'))
      .then((data) => {
        if (data && data.length !== 0) {
          this.username = data.User.username;
          return data.User.username;
        }
      })
      .catch((error) => {
        if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
        this.sharedService.message('Error al intentar obtener registros.');
        throw error;
      });
  }
}
