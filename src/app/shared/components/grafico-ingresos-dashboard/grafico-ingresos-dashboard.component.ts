import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SharedService } from '@services/shared/shared.service';
import { configuracion, moneyIncome } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-grafico-ingresos-dashboard',
  templateUrl: './grafico-ingresos-dashboard.component.html',
  styleUrls: ['./grafico-ingresos-dashboard.component.css']
})
export class GraficoIngresosDashboardComponent implements OnInit, AfterViewInit {
/*   public dataSource: moneyIncome[] = []; */
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

  public filteredData: any[] = [];
  public availableYears: string[] = [];
  public selectedYear: string = this.availableYears[0];
  public Categories: string[] = [];
  public selectedCategory: string = 'Todos los rubros';

  public incomeData: moneyIncome[] = [];

  constructor(
    public sharedService: SharedService,
    public dataService: DataService) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Ingresos$.subscribe({
      next: (data) => {

        this.incomeData = data.map((item) => ({
          date: item.date,
          category: item.category,
          amount: item.amount,
        }));

        this.inicioUnico();
      },
      error: (error) => {
        console.error(error)
      }
    });
    this.dataService.fetchIngresos('GET');
  }

  ngAfterViewInit() {
  }

  private inicioUnico() {
    this.availableYears = this.getAvailableYears();
    this.selectedYear = this.availableYears[0];
    this.Categories = this.sharedService.categories;
    if (!this.Categories.includes('Todos los rubros'))
      this.Categories.push('Todos los rubros');
    this.selectedCategory = this.Categories[this.Categories.length - 1];
    this.globalFilter();
  }

  private getAvailableYears(): string[] {
    if (this.incomeData.length == 0) return [];
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
        groupedData[month].total += parseFloat(entry.amount);
      } else {
        groupedData[month] = {
          month: month,
          total: parseFloat(entry.amount)
        };
      }
    }
    const sortedMonths = Object.keys(groupedData).sort();
    const orderedData = sortedMonths.map(month => groupedData[month]);
    return orderedData;
  }

  public globalFilter() {
    if (this.incomeData.length == 0) return;
    this.availableYears = this.getAvailableYears();
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
