import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TokenService } from '@services/token/token.service';
import { CacheService } from '@services/cache/cache.service';
import { empresa } from '@models/mainClasses/main-classes';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public Empresa: empresa | null = null;
  public sidenavOpened = true;
  public icono: any = '';

  constructor(
    public dataService: DataService,
    public tokenService: TokenService,
    private cacheService: CacheService
  ) { }

  ngOnInit() {
    this.cacheService.clear();
    this.dataInit();
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
    this.sidenavOpened = !this.sidenavOpened;
  }

  salir() {
    this.cacheService.clear();
    this.tokenService.logout();
  }
}




