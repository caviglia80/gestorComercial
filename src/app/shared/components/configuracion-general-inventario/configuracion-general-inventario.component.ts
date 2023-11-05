import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-inventario',
  templateUrl: './configuracion-general-inventario.component.html',
  styleUrls: ['./configuracion-general-inventario.component.css']
})
export class ConfiguracionGeneralInventarioComponent implements OnInit {
  public dataConfig: configuracion = new configuracion();
  public pvp = '0';

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
   /*  this.dataInit();*/
  }

/*   private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig !== undefined) {
        this.pvp = this.dataConfig.margenBeneficio;
      }
    });
  }

  public setPvp(pvp: string) {
    if (pvp !== this.dataConfig.margenBeneficio)
      this.dataService.fetchConfiguracion('PUT', { id: 1, margenBeneficio: pvp });
  } */

}
