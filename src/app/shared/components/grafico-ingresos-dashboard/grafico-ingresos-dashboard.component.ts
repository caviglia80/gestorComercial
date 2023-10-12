import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SharedService } from '@services/shared/shared.service';

@Component({
  selector: 'app-grafico-ingresos-dashboard',
  templateUrl: './grafico-ingresos-dashboard.component.html',
  styleUrls: ['./grafico-ingresos-dashboard.component.css']
})
export class GraficoIngresosDashboardComponent implements OnInit, AfterViewInit {
  public groupedIncomeData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartData: any[] = [];
  public lineChartType: ChartType = 'line';

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      },
    },
  };

  public incomeData = [
    { date: '2023-03-20', category: 'Ventas', amount: 100 },
    { date: '2023-04-20', category: 'Ventas', amount: 5500 },
    { date: '2023-05-20', category: 'Ventas', amount: 1500 },
    { date: '2023-06-20', category: 'Ventas', amount: 6500 },
    { date: '2023-07-20', category: 'Ventas', amount: 1500 },
    { date: '2023-08-20', category: 'Ventas', amount: 7500 },
    { date: '2023-09-20', category: 'Ventas', amount: 300 },
    { date: '2023-10-20', category: 'Ventas', amount: 8500 },
    { date: '2023-11-20', category: 'Ventas', amount: 1500 },
    { date: '2022-01-15', category: 'Ventas', amount: 100 },
    { date: '2022-02-20', category: 'Ventas', amount: 200 },
    { date: '2022-03-20', category: 'Ventas', amount: 300 },
    { date: '2022-04-20', category: 'Extraordinarios', amount: 400 },
    { date: '2022-05-20', category: 'Ventas', amount: 500 },
    { date: '2022-06-20', category: 'Ventas', amount: 600 },
    { date: '2022-07-20', category: 'Extraordinarios', amount: 600 },
    { date: '2022-08-20', category: 'Ventas', amount: 500 },
    { date: '2022-09-20', category: 'Ventas', amount: 400 },
    { date: '2022-10-20', category: 'Ventas', amount: 300 },
    { date: '2022-12-10', category: 'Otra Actividad', amount: 200 },
    { date: '2021-05-10', category: 'Ventas', amount: 200 },
    { date: '2022-12-10', category: 'Otra Actividad', amount: 1250 }
  ];

  public filteredData: any[] = [];
  public availableYears: string[] = this.getAvailableYears();
  public selectedYear: string = this.availableYears[0];

  public Categories: string[] = [];
  public selectedCategory: string = 'Todos los rubros';

  constructor(public sharedService: SharedService) { }

  ngOnInit() {
    this.globalFilter();
    this.Categories = this.sharedService.categories;
    this.Categories.push('Todos los rubros');
    this.selectedCategory = this.Categories[this.Categories.length - 1];
  }

  ngAfterViewInit() {
  }

  private getAvailableYears(): string[] {
    const years = new Set<string>();
    for (const entry of this.incomeData) {
      const year = entry.date.substring(0, 4);
      years.add(year);
    }
    return Array.from(years);
  }

  /* doughnut pie line */
  private groupAndSumByMonth(data: any[]): any[] {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      data.push({ date: this.selectedYear + '-' + month + '-01', amount: 0 });
    });

    const groupedData: { [key: string]: any } = {};
    for (const entry of data) {
      const month = entry.date.substring(0, 7);
      if (groupedData[month]) {
        groupedData[month].total += entry.amount;
      } else {
        groupedData[month] = {
          month: month,
          total: entry.amount
        };
      }
    }
    const sortedMonths = Object.keys(groupedData).sort();
    const orderedData = sortedMonths.map(month => groupedData[month]);
    return orderedData;
  }

  public globalFilter() {
    if (this.selectedYear.length === 0 || this.selectedCategory.length === 0) return;
    this.filteredData = this.incomeData.filter(entry => entry.date.startsWith(this.selectedYear));
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.filteredData = this.filteredData.filter(entry => entry.category.startsWith(this.selectedCategory));
    this.groupedIncomeData = this.groupAndSumByMonth(this.filteredData);
    this.lineChartLabels = this.groupedIncomeData.map(item => item.month);
    /*     this.lineChartData = [{ data: this.groupedIncomeData.map(item => item.total), label: 'Ingresos' }]; */
    this.lineChartData = [{
      label: 'Ingresos',
      data: this.groupedIncomeData.map(item => item.total),
      backgroundColor: 'blue',
      borderColor: 'blue',
      pointBackgroundColor: 'blue',
      pointBorderColor: 'black',
      pointRadius: 2,
      fill: false,
      lineTension: 0.1,
      borderWidth: 2,
    }];
  }



}
