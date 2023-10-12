import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-ingreso',
  templateUrl: './configuracion-general-ingreso.component.html',
  styleUrls: ['./configuracion-general-ingreso.component.css']
})
export class ConfiguracionGeneralIngresoComponent {

  public dataConfig: configuracion = new configuracion();
  public ingresoRestaStockEnabled: boolean = false;
  public ingresoRapidoEnabled: boolean = false;
  public ingresoAnuladoSumaStockEnabled: boolean = false;

  constructor(
    public dataService: DataService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig !== undefined) {
        this.ingresoRestaStockEnabled = this.dataConfig.ingresoRestaStockEnabled === '1';
        this.ingresoRapidoEnabled = this.dataConfig.ingresoRapidoEnabled === '1';
        this.ingresoAnuladoSumaStockEnabled = this.dataConfig.ingresoAnuladoSumaStockEnabled === '1';
      }
    });
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
}
