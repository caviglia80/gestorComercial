import { Component } from '@angular/core';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-ingresos-dashboard',
  templateUrl: './grafico-ingresos-dashboard.component.html',
  styleUrls: ['./grafico-ingresos-dashboard.component.css']
})
export class GraficoIngresosDashboardComponent {
  public incomeData = [
    { date: '2023-01-15', amount: 1000 },
    { date: '2023-02-20', amount: 2500 },
    { date: '2023-03-20', amount: 100 },
    { date: '2023-04-20', amount: 5500 },
    { date: '2023-05-20', amount: 1500 },
    { date: '2023-06-20', amount: 6500 },
    { date: '2023-07-20', amount: 1500 },
    { date: '2023-08-20', amount: 7500 },
    { date: '2023-09-20', amount: 300 },
    { date: '2023-10-20', amount: 8500 },
    { date: '2023-11-20', amount: 1500 },
    { date: '2023-12-10', amount: 800 }
  ];

  public lineChartOptions: any = {
    responsive: true,
  };

  public lineChartLabels: string[] = this.incomeData.map(item => item.date);
  public lineChartData: any[] = [{ data: this.incomeData.map(item => item.amount), label: 'Ingresos' }];
  public lineChartType: ChartType = 'line';
}
