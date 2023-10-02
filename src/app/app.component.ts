import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';

declare global {
  interface Date {
    addHours(hours: number): Date;
  }
}

Date.prototype.addHours = function (hours: number): Date {
  const date = new Date(this.valueOf());
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gestorComercial';

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.cargarIcono(data[0] !== undefined ? data[0].icono : '');
    });
  }

  private cargarIcono(icon: string) {
    const link = document.querySelector('#page-icon') as HTMLLinkElement;
    link.href = icon;
  }
}
