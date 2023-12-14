import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { empresa } from '@models/mainClasses/main-classes';
import { GlobalVariables } from 'src/app/app.component';
import { SharedService } from '@services/shared/shared.service';
@Component({
  selector: 'app-renovacion',
  templateUrl: './renovacion.component.html',
  styleUrls: ['./renovacion.component.css']
})
export class RenovacionComponent implements OnInit {
  public fechaVencimiento: String = '00-00-0000';
  public dataEmpresa: empresa = new empresa();

  public fechaOk: boolean = false;
  public fechaCercaVencimiento: boolean = false;
  public fechaPorVencerOvencido: boolean = false;

  constructor(
    private cacheService: CacheService,
    public sharedService: SharedService,
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
          this.fechaVencimiento = this.sharedService.fechaFormateada(this.dataEmpresa.fechaVencimiento);
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
    const diferenciaDias = this.sharedService.getDiasDeDiferencia(fecha);

    if (diferenciaDias <= 0) {
      this.fechaOk = false;
      this.fechaCercaVencimiento = false;
      this.fechaPorVencerOvencido = true;
    } else if (diferenciaDias <= 5) {
      this.fechaOk = false;
      this.fechaCercaVencimiento = true;
      this.fechaPorVencerOvencido = false;
    } else if (diferenciaDias >= 6) {
      this.fechaOk = true;
      this.fechaCercaVencimiento = false;
      this.fechaPorVencerOvencido = false;
    }
  }

  abrirWhatsApp(periodo: string) {
    const mensaje = `Hola, estoy interesado en extender mi periodo de licencia a ${periodo} mas.`;
    const referencia = `Codigo: EM${this.dataEmpresa.id}`;
    const wsp = `https://wa.me/${GlobalVariables.wspNumer}?text=${encodeURIComponent(mensaje + ' ' + referencia)}`;
    window.open(wsp, '_blank', 'noopener,noreferrer');
  }
}
