import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { Router } from '@angular/router';
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

  private ds_EmpresaInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public EmpresaInfo$: Observable<any> = this.ds_EmpresaInfo.asObservable();
  private EmpresaInfo: any = null;
  private periodoVencido: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    public sharedService: SharedService
  ) { }

  async canAccess(ruta: string): Promise<boolean> {
    if (ruta.includes('login')) return true;
    if (!this.UserInfo) await this.refreshUserInfo();

    if (this.UserInfo) {
      if (this.UserInfo.isSa) {
        if (ruta.includes('clientes')) return true;
      } else {
        if (ruta.includes('clientes')) return false;
        if (!this.EmpresaInfo) await this.refreshEmpresaInfo();

        if (this.UserInfo.isAdmin) {
          if (this.periodoVencido && ruta.includes('renovacion')) return true;
          if (this.periodoVencido) {
            this.router.navigate(['/nav/renovacion']);
            return false;
          }
          return true;
        } else {
          if (this.periodoVencido && ruta.includes('inicio')) return true;
          if (this.periodoVencido) {
            this.router.navigate(['/nav/inicio']);
            return false;
          }
          if (this.UserInfo.rol) {
            const menus: Menu[] = this.UserInfo.rol.menus;
            if (menus) return menus.some(menu => menu.ruta === ruta && menu.habilitado); else return false;
          } else return false;
        }
      }
    }
    return false;
  }

  getFirstEnabledRoute(): string {
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

  refreshUserInfo(): Promise<any> {
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

  refreshEmpresaInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${SharedService.host}DB/empresa.php`).subscribe({
        next: (data) => {
          if (data[0] && data[0].length !== 0) {
            this.EmpresaInfo = data[0];
            if (this.EmpresaInfo.fechaVencimiento)
              if (this.sharedService.getDiasDeDiferencia(this.EmpresaInfo.fechaVencimiento) <= 0)
                this.periodoVencido = true; else this.periodoVencido = false;
            this.ds_EmpresaInfo.next(this.EmpresaInfo);
          }
          resolve(this.EmpresaInfo);
        }
      });
    });
  }
}
