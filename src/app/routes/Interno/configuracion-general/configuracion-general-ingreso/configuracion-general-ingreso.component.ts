import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-ingreso',
  templateUrl: './configuracion-general-ingreso.component.html',
  styleUrls: ['./configuracion-general-ingreso.component.css']
})
export class EmpresaConfiguracionIngresoComponent implements OnInit {

  public dataEmpresa: empresa = new empresa();
  public ingresoRestaStockEnabled = false;
  public ingresoRapidoEnabled = false;
  public ingresoAnuladoSumaStockEnabled = false;
  public permitirStockCeroEnabled = false;
  public validarInventarioEnabled = false;

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
        this.ingresoRestaStockEnabled = this.dataEmpresa.ingresoRestaStockEnabled === '1';
        this.ingresoRapidoEnabled = this.dataEmpresa.ingresoRapidoEnabled === '1';
        this.ingresoAnuladoSumaStockEnabled = this.dataEmpresa.ingresoAnuladoSumaStockEnabled === '1';
        this.permitirStockCeroEnabled = this.dataEmpresa.permitirStockCeroEnabled === '1';
        this.validarInventarioEnabled = this.dataEmpresa.validarInventarioEnabled === '1';
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  public habilitarIngresoRestaStock(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { ingresoRestaStockEnabled: isChecked ? "1" : "0" });
  }

  public habilitarIngresoRapido(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { ingresoRapidoEnabled: isChecked ? "1" : "0" });
  }

  public habilitarAnularIngresoSumaStock(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { ingresoAnuladoSumaStockEnabled: isChecked ? "1" : "0" });
  }

  public habilitarPermitirStockCeroEnabled(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { permitirStockCeroEnabled: isChecked ? "1" : "0" });
  }

  public habilitarvalidarInventarioEnabled(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { validarInventarioEnabled: isChecked ? "1" : "0" });
  }
}
