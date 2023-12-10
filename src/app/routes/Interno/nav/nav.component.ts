import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TokenService } from '@services/token/token.service';
import { CacheService } from '@services/cache/cache.service';
import { empresa } from '@models/mainClasses/main-classes';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public Empresa: empresa | null = null;
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
  public roles: boolean = false;

  public usuario: string = '';
  public rol: string = '';

  constructor(
    public dataService: DataService,
    public tokenService: TokenService,
    private cacheService: CacheService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cacheService.clear();
    this.dataInit();
    this.canView();
    this.getUserInfo();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0]) {
        this.Empresa = data[0];
        if (this.Empresa!.icono) {
          this.icono = this.Empresa!.icono;
          const link = document.querySelector('#page-icon') as HTMLLinkElement;
          link.href = this.Empresa!.icono;
        }
        if (this.Empresa!.color1 && this.Empresa!.color2) {
          document.documentElement.style.setProperty('--color-1', this.Empresa!.color1);
          document.documentElement.style.setProperty('--color-2', this.Empresa!.color2);
        }
        if (this.Empresa!.nombre) {
          document.title = this.Empresa!.nombre;
        }
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  public toggleSidenav() {
    this.canView();
    this.getUserInfo();
    this.sidenavOpened = !this.sidenavOpened;
  }

  public salir() {
    this.cacheService.clear();
    this.tokenService.logout();
  }

  private canView() {
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
  }

  public getUserInfo() {
    Promise.all([
      this.authService.getRolName(),
      this.authService.getUsername()
    ]).then(([rol, username]) => {
      if (rol)
        this.rol = rol;
      if (username)
        this.usuario = username;
    }).catch(error => {
      console.error('Error al obtener la información del usuario: ', error);
    });
  }

}




