import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-egreso-config',
  templateUrl: './egreso-config.component.html',
  styleUrls: ['./egreso-config.component.css']
})
export class EgresoConfigComponent {
  public dataConfig: configuracion = new configuracion();
  public egresoRapidoEnabled: boolean = false;
  public egresoSumaStockEnabled: boolean = false;

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
        this.egresoRapidoEnabled = this.dataConfig.egresoRapidoEnabled === '1';
        this.egresoSumaStockEnabled = this.dataConfig.egresoSumaStockEnabled === '1';
      }
    });
  }

  public habilitarEgresoRapido(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, egresoRapidoEnabled: isChecked ? "1" : "0" });
  }

  public habilitarEgresoSumaStock(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, egresoSumaStockEnabled: isChecked ? "1" : "0" });
  }
}
