import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@services/shared/shared.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from '@services/data/data.service';
interface Menu {
  ruta: string;
  nombre: string;
  habilitado: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private ds_UserInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public UserInfo$: Observable<any> = this.ds_UserInfo.asObservable();
  private UserInfo: any = null;

  constructor(
    private http: HttpClient,
    public dataService: DataService,
    public sharedService: SharedService
  ) {
    //  this.menus = [
    //  { "ruta": "/nav/dashboard", "nombre": "Panel", "habilitado": false },
    //  { "ruta": "/nav/ingresos", "nombre": "Ingresos", "habilitado": false },
    //  { "ruta": "/nav/egresos", "nombre": "Egresos", "habilitado": false },
    //  { "ruta": "/nav/inventario", "nombre": "Inventario", "habilitado": false },
    //  { "ruta": "/nav/proveedores", "nombre": "Proveedores", "habilitado": false },
    //  { "ruta": "/nav/reportes", "nombre": "Reportes", "habilitado": false },
    //  { "ruta": "/nav/general", "nombre": "General", "habilitado": false },
    //  { "ruta": "/nav/usuarios", "nombre": "Usuarios", "habilitado": false },
    //  { "ruta": "/nav/roles", "nombre": "Roles", "habilitado": false }
    //   ];
  }

  async canAccess(ruta: string): Promise<boolean> {
    if (!this.UserInfo)
      await this.refreshUserInfo();
    if (this.UserInfo && this.UserInfo.isAdmin) return true;
    if (this.UserInfo)
      if (this.UserInfo.rol) {
        const menus: Menu[] = this.UserInfo.rol.menus;
        if (menus)
          return menus.some(menu => menu.ruta === ruta && menu.habilitado);
        else return false;
      }
      else return false;
    else return false;
  }

  getFirstEnabledRoute(): string {
    if (this.UserInfo && this.UserInfo.isAdmin) return '/nav/dashboard';
    if (this.UserInfo)
    if (this.UserInfo.rol) {
      const menus: Menu[] = this.UserInfo.rol.menus;
      const firstEnabledMenu = menus.find(menu => menu.habilitado);
      if (menus)
      return firstEnabledMenu ? firstEnabledMenu.ruta : '/nav/inicio';
      else return '/nav/inicio';
    }
    else return '/nav/inicio';
  else return '/nav/inicio';
  }

  availableMenus(): boolean {
    if (this.UserInfo.isAdmin) return true;
    if (this.UserInfo)
      if (this.UserInfo.rol)
        return this.UserInfo.rol.menus.length > 0;
      else return false;
    else return false;
  }

  refreshUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${SharedService.host}DB/guard.php`).subscribe({
        next: (data) => {
          if (data && data.length !== 0) {
            this.UserInfo = data;
            if (this.UserInfo.rol)
              if (this.UserInfo.rol.menus)
                this.UserInfo.rol.menus = JSON.parse(this.UserInfo.rol ? this.UserInfo.rol.menus : '[]');
            this.ds_UserInfo.next(this.UserInfo);
          }
          resolve(this.UserInfo);
        }
      });
    });
  }










}
