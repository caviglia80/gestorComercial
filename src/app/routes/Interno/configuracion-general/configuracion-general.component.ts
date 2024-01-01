import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
@Component({
  selector: 'app-configuracion-general',
  templateUrl: './configuracion-general.component.html',
  styleUrls: ['./configuracion-general.component.css']
})
export class EmpresaConfiguracionComponent implements OnInit {
  constructor(
    public dataService: DataService
  ) { }

  async ngOnInit() {
    await this.dataService.fetchEmpresa('GET');
  }
}








