import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { Router } from '@angular/router';
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

  // private ds_EmpresaInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // public EmpresaInfo$: Observable<any> = this.ds_EmpresaInfo.asObservable();
  private EmpresaInfo: any = null;
  private periodoVencido: boolean = false;

  constructor(
    public dataService: DataService,
    private http: HttpClient,
    private router: Router,
    public sharedService: SharedService
  ) { }

  async canAccess(ruta: string): Promise<boolean> {
    if (ruta.includes('login')) return true;
    if (!this.UserInfo) await this.refreshUserInfo();

    if (this.UserInfo) {
      if (this.UserInfo.isSa) {                                    //SA
        if (ruta.includes('clientes')) return true;

      } else {                                                     //Admin y Empleado
        if (ruta.includes('clientes')) return false;
        if (!this.EmpresaInfo) await this.refreshEmpresaInfo();

        if (this.UserInfo.isAdmin) {                               //Admin
          if (this.periodoVencido && ruta.includes('renovacion')) return true;
          if (this.periodoVencido) {
            this.router.navigate(['/nav/renovacion']);
            return false;
          }
          return true;
        } else {                                                   //Empleado

          if (this.UserInfo.rol) {
            const menus: Menu[] = this.UserInfo.rol.menus;
            const tieneRenovacionHabilitado = menus.some(menu => menu.ruta.includes('renovacion') && menu.habilitado);

            if (this.periodoVencido) {

              if (tieneRenovacionHabilitado && ruta.includes('renovacion')) return true;
              if (tieneRenovacionHabilitado) {           //es empleado pero con renovacion habilitado
                this.router.navigate(['/nav/renovacion']);
                return false;
              }

              if (ruta.includes('inicio')) return true;  //es empleado pero no tiene habilitado renovacion
              this.router.navigate(['/nav/inicio']);
              return false;

            }

            // este es el mas importante, le dice a los empleados que puede ver/acceder
            if (menus) return menus.some(menu => menu.ruta === ruta && menu.habilitado);
            else return false;
          } else return false;
        }
      }
    }
    return false;
  }

  async getFirstEnabledRoute(): Promise<string> {
    if (this.UserInfo.isSa) return '/nav/clientes';
    if (this.UserInfo && !this.UserInfo.isAdmin && this.periodoVencido) return '/nav/inicio';
    if (this.UserInfo && this.UserInfo.isAdmin && this.periodoVencido) return '/nav/renovacion';

    if (this.UserInfo && this.UserInfo.isAdmin) return '/nav/dashboard';
    if (this.UserInfo)
      if (this.UserInfo.rol) {
        const menus: Menu[] = this.UserInfo.rol.menus;
        const firstEnabledMenu = menus.find(menu => menu.habilitado);
        if (menus) return firstEnabledMenu ? firstEnabledMenu.ruta : '/nav/inicio';
        else return '/nav/inicio';
      }
      else return '/nav/inicio';
    else return '/nav/inicio';
  }

  availableMenus(): boolean {
    if (this.UserInfo.isSa) return true;
    if (this.UserInfo && this.UserInfo.isAdmin) return true;
    if (this.UserInfo && this.UserInfo.rol) return this.UserInfo.rol.menus.length > 0;
    else return false;
  }

  async adminAvailableMenus(): Promise<boolean> {
    if (!this.UserInfo) await this.refreshUserInfo();
    if (this.UserInfo.isSa) return true;
    if (!this.EmpresaInfo) await this.refreshEmpresaInfo();

    if (this.UserInfo && this.UserInfo.isAdmin) return true;
    if (this.UserInfo && !this.UserInfo.isAdmin && this.periodoVencido) return true;

    if (this.UserInfo && this.UserInfo.rol) {
      const menus: Menu[] = this.UserInfo.rol.menus;
      if (menus) return menus.some(menu => menu.habilitado);
    } else return false;
    return false;
  }

  async refreshUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${SharedService.host}DB/guard.php`).subscribe({
        next: (data) => {
          if (data) {
            this.UserInfo = data;
            if (this.UserInfo.rol)
              if (this.UserInfo.rol.menus)
                this.UserInfo.rol.menus = JSON.parse(this.UserInfo.rol ? this.UserInfo.rol.menus : '[]');
            this.ds_UserInfo.next(this.UserInfo);
          }
          resolve(this.UserInfo);
        }, error: (error) => {
          localStorage.removeItem('jwt');
          this.router.navigate(['']);
        }
      });
    });
  }

  async refreshEmpresaInfo() {
    const data = await this.dataService.fetchEmpresa('GET');
    if (data) {
      this.EmpresaInfo = data;
      if (this.EmpresaInfo.fechaVencimiento)
        if (this.sharedService.getDiasDeDiferencia(this.EmpresaInfo.fechaVencimiento) <= 0) {
          this.periodoVencido = true;
          await this.refreshUserInfo();
        } else {
          this.periodoVencido = false;
          await this.refreshUserInfo();
        }
    }
  }

  async getPeriodoVencido(): Promise<boolean> {
    return this.periodoVencido;
  }
}
