import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-egreso',
  templateUrl: './configuracion-general-egreso.component.html',
  styleUrls: ['./configuracion-general-egreso.component.css']
})
export class ConfiguracionGeneralEgresoComponent implements OnInit {
  public dataConfig: configuracion = new configuracion();
  public egresoRapidoEnabled = false;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig) {
        this.egresoRapidoEnabled = this.dataConfig.egresoRapidoEnabled === '1';
      }
    });
    this.dataService.fetchConfiguracion('GET');
  }

  public habilitarEgresoRapido(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, egresoRapidoEnabled: isChecked ? "1" : "0" });
  }
}
