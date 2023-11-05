import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public sidenavOpened = true;
  public icono: any = '';

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  public toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.icono = data[0] !== undefined ? data[0].icono : ''
    });
  }
}




