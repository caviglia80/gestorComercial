import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { TokenService } from '@services/token/token.service';
import { CacheService } from '@services/cache/cache.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
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
        if (data[0].icono) {
          this.icono = data[0].icono;
          const link = document.querySelector('#page-icon') as HTMLLinkElement;
          link.href = data[0].icono;
        }
        if (data[0].color1 && data[0].color2) {
          document.documentElement.style.setProperty('--color-1', data[0].color1);
          document.documentElement.style.setProperty('--color-2', data[0].color2);
        }
        if (data[0].titulo) {
          document.title = data[0].titulo;
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




