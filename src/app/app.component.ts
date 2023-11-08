import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { Injectable } from '@angular/core';

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
  title = '';
  private dataSource: any;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();

  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataSource = data[0];
      if (this.dataSource !== undefined) {
        this.cargarIcono(this.dataSource.icono !== undefined ? this.dataSource.icono : '');
        document.documentElement.style.setProperty('--color-1', this.dataSource.color1);
        document.documentElement.style.setProperty('--color-2', this.dataSource.color2);
        this.cargarTitulo(this.dataSource.titulo);
      }
    });
  }

  private cargarIcono(icon: string) {
    const link = document.querySelector('#page-icon') as HTMLLinkElement;
    link.href = icon;
  }

  private cargarTitulo(titulo: string) {
    document.title = titulo;
    this.title = titulo;
  }

}

@Injectable()
export class GlobalVariables {
  public static wspNumer: string = '+5492364336228';
  public static wspTxt: string = '';
}
