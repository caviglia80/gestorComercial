import { Component } from '@angular/core';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  view = "0";

  constructor(
    public dataService: DataService
    ) { }

}
