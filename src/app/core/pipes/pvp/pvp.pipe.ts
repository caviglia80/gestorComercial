import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Pipe({
  name: 'pvp'
})
export class PvpPipe implements PipeTransform {
  public dataConfiguration: configuracion = new configuracion();

  constructor(
    private dataService: DataService
  ) {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataConfiguration = data[0];
    });
  }

  public transform(value: any): number {
    const margin = (this.dataConfiguration.pvpPorcentaje / 100);
    return parseFloat(value) * (1 + margin);
  }

}
