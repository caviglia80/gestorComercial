import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  view: string = "0";

  constructor(
    public dataService: DataService) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.fetchIngresos('GET');
    this.dataService.fetchEgresos('GET');
  }
}
