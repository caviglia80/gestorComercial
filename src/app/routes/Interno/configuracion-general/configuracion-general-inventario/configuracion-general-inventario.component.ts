import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-inventario',
  templateUrl: './configuracion-general-inventario.component.html',
  styleUrls: ['./configuracion-general-inventario.component.css']
})
export class EmpresaConfiguracionInventarioComponent implements OnInit {
  public dataEmpresa: empresa = new empresa();

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

      }
    });
    this.dataService.fetchEmpresa('GET');
  }
}
