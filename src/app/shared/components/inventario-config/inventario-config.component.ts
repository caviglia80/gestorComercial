import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-inventario-config',
  templateUrl: './inventario-config.component.html',
  styleUrls: ['./inventario-config.component.css']
})
export class InventarioConfigComponent implements OnInit {
  public dataConfig: configuracion = new configuracion();
  public pvp: string = '0';

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
        this.pvp = this.dataConfig.pvpPorcentaje;
      }
    });
  }

  public setPvp(pvp: string) {
    if (pvp !== this.dataConfig.pvpPorcentaje)
      this.dataService.fetchConfiguracion('PUT', { id: 1, pvpPorcentaje: pvp });
  }

}
