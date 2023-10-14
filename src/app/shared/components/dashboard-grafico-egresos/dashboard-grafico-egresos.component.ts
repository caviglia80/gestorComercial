import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { moneyOutlays } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-egresos',
  templateUrl: './dashboard-grafico-egresos.component.html',
  styleUrls: ['./dashboard-grafico-egresos.component.css']
})
export class DashboardGraficoEgresosComponent implements OnInit {
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      },
    },
  };

  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartType: ChartType = 'line';

  public incomeData: moneyOutlays[] = [];
  public groupedIncomeData: any[] = [];
  public filteredData: any[] = [];

  public Years: string[] = [];
  public selectedYear: string = '';
  public Categories: string[] = [];
  public selectedCategory: string = 'Todos los rubros';

  constructor(
    public dataService: DataService) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Egresos$.subscribe({
      next: (data) => {

        this.incomeData = data.map((item) => ({
          date: item.date,
          category: item.category,
          amount: item.amount,
        }));

        this.init();
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

  private init() {
    this.setYears(this.incomeData);
    this.globalFilter();
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
    if (this.selectedYear.length === 0 || this.selectedCategory.length === 0) return;
    this.filteredData = this.incomeData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.incomeData);
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.filteredData = this.filteredData.filter(entry => entry.category.startsWith(this.selectedCategory));
    this.groupedIncomeData = this.groupAndSumByMonth(this.filteredData);
    this.lineChartLabels = this.groupedIncomeData.map(item => item.month);
    /*     this.lineChartData = [{ data: this.groupedIncomeData.map(item => item.total), label: 'Ingresos' }]; */
    this.lineChartData = [{
      label: 'Egresos',
      data: this.groupedIncomeData.map(item => item.total),
      backgroundColor: this.dataService.getCurrentConfiguracion().color2,
      borderColor: this.dataService.getCurrentConfiguracion().color1,
      pointBackgroundColor: this.dataService.getCurrentConfiguracion().color2,
      pointBorderColor: this.dataService.getCurrentConfiguracion().color1,
      pointRadius: 2,
      fill: false,
      lineTension: 0.1,
      borderWidth: 2,
    }];
  }

  private setYears(data: any) {
    if (data.length == 0) return;
    const years = new Set<string>();
    for (const entry of this.incomeData)
      years.add(entry.date.substring(0, 4));
    this.Years = Array.from(years);
    this.selectedYear = this.Years[0];
  }

  private setCategories(data: any) {
    if (data.length == 0) return;
    const filteredCategoriesSet = new Set<string>();
    for (const entry of data)
      filteredCategoriesSet.add(entry.category);
    filteredCategoriesSet.add('Todos los rubros');
    this.Categories = Array.from(filteredCategoriesSet);
  }
}
