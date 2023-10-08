import { Component } from '@angular/core';
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

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig !== undefined) {
        this.egresoRapidoEnabled = this.dataConfig.egresoRapidoEnabled === '1';
      }
    });
  }

  public habilitarEgresoRapido(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, egresoRapidoEnabled: isChecked ? "1" : "0" });
  }
}
