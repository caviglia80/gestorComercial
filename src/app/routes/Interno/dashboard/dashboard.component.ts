import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  view = "0";

  constructor(
    public dataService: DataService
  ) { }

  async ngOnInit() {
    await this.dataService.fetchEmpresa('GET');
    this.dataService.fetchIngresos('GET');
    this.dataService.fetchEgresos('GET');
  }
}
