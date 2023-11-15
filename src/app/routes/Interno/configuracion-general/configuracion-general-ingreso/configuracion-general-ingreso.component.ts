import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-ingreso',
  templateUrl: './configuracion-general-ingreso.component.html',
  styleUrls: ['./configuracion-general-ingreso.component.css']
})
export class EmpresaConfiguracionIngresoComponent implements OnInit {

  public dataConfig: empresa = new empresa();
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
    this.dataService.Empresa$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig) {
        this.ingresoRestaStockEnabled = this.dataConfig.ingresoRestaStockEnabled === '1';
        this.ingresoRapidoEnabled = this.dataConfig.ingresoRapidoEnabled === '1';
        this.ingresoAnuladoSumaStockEnabled = this.dataConfig.ingresoAnuladoSumaStockEnabled === '1';
        this.permitirStockCeroEnabled = this.dataConfig.permitirStockCeroEnabled === '1';
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  public habilitarIngresoRestaStock(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { id: 1, ingresoRestaStockEnabled: isChecked ? "1" : "0" });
  }

  public habilitarIngresoRapido(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { id: 1, ingresoRapidoEnabled: isChecked ? "1" : "0" });
  }

  public habilitarAnularIngresoSumaStock(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { id: 1, ingresoAnuladoSumaStockEnabled: isChecked ? "1" : "0" });
  }

  public habilitarPermitirStockCeroEnabled(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { id: 1, permitirStockCeroEnabled: isChecked ? "1" : "0" });
  }
}
