import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-ingreso',
  templateUrl: './configuracion-general-ingreso.component.html',
  styleUrls: ['./configuracion-general-ingreso.component.css']
})
export class ConfiguracionGeneralIngresoComponent implements OnInit {

  public dataConfig: configuracion = new configuracion();
  public ingresoRestaStockEnabled = false;
  public ingresoRapidoEnabled = false;
  public ingresoAnuladoSumaStockEnabled = false;
  public permitirStockCeroEnabled = false;

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
        this.ingresoRestaStockEnabled = this.dataConfig.ingresoRestaStockEnabled === '1';
        this.ingresoRapidoEnabled = this.dataConfig.ingresoRapidoEnabled === '1';
        this.ingresoAnuladoSumaStockEnabled = this.dataConfig.ingresoAnuladoSumaStockEnabled === '1';
        this.permitirStockCeroEnabled = this.dataConfig.permitirStockCeroEnabled === '1';
      }
    });
    this.dataService.fetchConfiguracion('GET');
  }

  public habilitarIngresoRestaStock(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, ingresoRestaStockEnabled: isChecked ? "1" : "0" });
  }

  public habilitarIngresoRapido(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, ingresoRapidoEnabled: isChecked ? "1" : "0" });
  }

  public habilitarAnularIngresoSumaStock(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, ingresoAnuladoSumaStockEnabled: isChecked ? "1" : "0" });
  }

  public habilitarPermitirStockCeroEnabled(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, permitirStockCeroEnabled: isChecked ? "1" : "0" });
  }
}
