import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { empresa } from '@models/mainClasses/main-classes';
import { GlobalVariables } from 'src/app/app.component';

@Component({
  selector: 'app-renovacion',
  templateUrl: './renovacion.component.html',
  styleUrls: ['./renovacion.component.css']
})
export class RenovacionComponent implements OnInit {
  public fechaVencimiento: String = '0000-00-00';
  public Empresa: empresa | null = null;
  public dataEmpresa: empresa = new empresa();

  public fechaOk: boolean = false;
  public fechaCercaVencimiento: boolean = false;
  public fechaPorVencerOvencido: boolean = false;

  constructor(
    private cacheService: CacheService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0]) {
        this.dataEmpresa = data[0];
        if (this.dataEmpresa.fechaVencimiento) {
          this.comprobarVencimiento(this.dataEmpresa.fechaVencimiento);
          this.fechaVencimiento = this.fechaFormateada(this.dataEmpresa.fechaVencimiento);
        } else {
          this.fechaOk = false;
          this.fechaCercaVencimiento = false;
          this.fechaPorVencerOvencido = false;
        }
      }
    });
    this.refresh();
  }

  refresh() {
    this.cacheService.remove('Empresa');
    this.dataService.fetchEmpresa('GET');
  }

  comprobarVencimiento(fecha: string) {
    const fechaObjeto = new Date(fecha);
    const fechaActual = new Date();

    // Diferencia en milisegundos
    const diferenciaMs = fechaObjeto.getTime() - fechaActual.getTime();

    // Convertir de milisegundos a días
    const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    if (diferenciaDias <= 1) {
      this.fechaOk = false;
      this.fechaCercaVencimiento = false;
      this.fechaPorVencerOvencido = true;
    } else if (diferenciaDias <= 2) {
      this.fechaOk = false;
      this.fechaCercaVencimiento = true;
      this.fechaPorVencerOvencido = false;
    } else if (diferenciaDias >= 3) {
      this.fechaOk = true;
      this.fechaCercaVencimiento = false;
      this.fechaPorVencerOvencido = false;
    }
  }

  private fechaFormateada(fecha: string): string {
    const fechaObjeto = new Date(fecha);
    const año = fechaObjeto.getFullYear();
    const mes = fechaObjeto.getMonth() + 1;
    const dia = fechaObjeto.getDate();

    const fechaFormateada = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${año}`;
    return fechaFormateada;
  }

  abrirWhatsApp(periodo: string) {
    const mensaje = `Hola, estoy interesado en extender mi periodo de licencia a ${periodo} mas.`;
    const referencia = `Codigo: EM${this.dataEmpresa.id}`;
    const wsp = `https://wa.me/${GlobalVariables.wspNumer}?text=${encodeURIComponent(mensaje + ' ' + referencia)}`;
    window.open(wsp, '_blank', 'noopener,noreferrer');
  }
}
