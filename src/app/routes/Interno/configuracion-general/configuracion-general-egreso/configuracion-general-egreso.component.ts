import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-egreso',
  templateUrl: './configuracion-general-egreso.component.html',
  styleUrls: ['./configuracion-general-egreso.component.css']
})
export class EmpresaConfiguracionEgresoComponent implements OnInit {
  public dataConfig: empresa = new empresa();
  public egresoRapidoEnabled = false;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig) {
        this.egresoRapidoEnabled = this.dataConfig.egresoRapidoEnabled === '1';
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  public habilitarEgresoRapido(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { id: 1, egresoRapidoEnabled: isChecked ? "1" : "0" });
  }
}
