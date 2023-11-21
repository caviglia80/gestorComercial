import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-egreso',
  templateUrl: './configuracion-general-egreso.component.html',
  styleUrls: ['./configuracion-general-egreso.component.css']
})
export class EmpresaConfiguracionEgresoComponent implements OnInit {
  public dataEmpresa: empresa = new empresa();
  public egresoRapidoEnabled = false;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      this.dataEmpresa = data[0];
      if (this.dataEmpresa) {
        this.egresoRapidoEnabled = this.dataEmpresa.egresoRapidoEnabled === '1';
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  public habilitarEgresoRapido(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { egresoRapidoEnabled: isChecked ? "1" : "0" });
  }
}
