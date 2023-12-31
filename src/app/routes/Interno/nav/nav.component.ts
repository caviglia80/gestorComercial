import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TokenService } from '@services/token/token.service';
import { CacheService } from '@services/cache/cache.service';
import { empresa } from '@models/mainClasses/main-classes';
import { AuthService } from '@services/auth/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoadingService } from '@services/loading/loading.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public dataEmpresa: empresa | null = null;
  public sidenavOpened = true;
  public icono: any = '';
  public dashboard: boolean = false;
  public ingresos: boolean = false;
  public egresos: boolean = false;
  public inventario: boolean = false;
  public proveedores: boolean = false;
  public reportes: boolean = false;
  public general: boolean = false;
  public usuarios: boolean = false;
  public renovacion: boolean = false;
  public roles: boolean = false;
  public clientes: boolean = false;

  private UserInfo: any = null;
  public username: string = '';
  public rolName: string = '';
  public isSa: boolean = false;

  constructor(
    public dataService: DataService,
    public tokenService: TokenService,
    private cacheService: CacheService,
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService
  ) {
    this.cacheService.clear();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.loadingService.isLoading.next(false);
      }
    });
  }

  async ngOnInit() {
    await this.dataInit();
    this.getUserInfo();
  }

  private async dataInit() {
    const data = await this.dataService.fetchEmpresa('GET');
    if (data) {
      this.dataEmpresa = data;

      this.icono = this.dataEmpresa!.icono || new empresa().icono || '';
      const link = document.querySelector('#page-icon') as HTMLLinkElement;
      link.href = this.icono;

      document.documentElement.style.setProperty('--color-1', this.dataEmpresa!.color1 || '#000000');
      document.documentElement.style.setProperty('--color-2', this.dataEmpresa!.color2 || '#000000');
      document.title = this.dataEmpresa!.nombre || '';
    }
  }

  public toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  public salir() {
    this.cacheService.clear();
    this.tokenService.logout();
  }

  private async canView() {
    this.authService.canAccess('/nav/clientes').then(puedeVer => {
      this.clientes = puedeVer;
    });

    this.authService.canAccess('/nav/dashboard').then(puedeVer => {
      this.dashboard = puedeVer;
    });

    this.authService.canAccess('/nav/ingresos').then(puedeVer => {
      this.ingresos = puedeVer;
    });

    this.authService.canAccess('/nav/egresos').then(puedeVer => {
      this.egresos = puedeVer;
    });

    this.authService.canAccess('/nav/inventario').then(puedeVer => {
      this.inventario = puedeVer;
    });

    this.authService.canAccess('/nav/proveedores').then(puedeVer => {
      this.proveedores = puedeVer;
    });

    this.authService.canAccess('/nav/reportes').then(puedeVer => {
      this.reportes = puedeVer;
    });

    this.authService.canAccess('/nav/general').then(puedeVer => {
      this.general = puedeVer;
    });

    this.authService.canAccess('/nav/usuarios').then(puedeVer => {
      this.usuarios = puedeVer;
    });

    this.authService.canAccess('/nav/roles').then(puedeVer => {
      this.roles = puedeVer;
    });

    this.authService.canAccess('/nav/renovacion').then(puedeVer => {
      this.renovacion = puedeVer;
    });
  }

  public async getUserInfo() {
    this.authService.UserInfo$.subscribe({
      next: (data) => {
        if (data) {
          this.UserInfo = data;
          if (this.UserInfo.username) this.username = this.UserInfo.username.trim(); else this.username = '';
          if (this.UserInfo.rol) this.rolName = this.UserInfo.rol.nombre.trim(); else this.rolName = '';
          if (this.UserInfo.isSa === 1) {
            this.isSa = true;
            this.rolName = 'Super Admin';
          }
          else this.isSa = false;
          this.canView();
        }
      }
    });
    //if (!this.UserInfo) await this.authService.refreshUserInfo();
    this.authService.refreshEmpresaInfo();
  }
}




