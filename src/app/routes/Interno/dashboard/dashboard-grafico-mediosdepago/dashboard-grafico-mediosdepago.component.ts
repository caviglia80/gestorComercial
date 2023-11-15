import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, LabelItem } from 'chart.js';
import { moneyIncome } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-mediosdepago',
  templateUrl: './dashboard-grafico-mediosdepago.component.html',
  styleUrls: ['./dashboard-grafico-mediosdepago.component.css']
})
export class DashboardGraficoMediosdepagoComponent implements OnInit {
  chartOptions: ChartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    responsive: true,
  };

  public chartData: any[] = [];
  public chartLabels: LabelItem[] = [];
  public chartType: ChartType = 'pie';

  public incomeData: moneyIncome[] = [];
  public groupedIncomeData: any[] = [];
  public filteredData: any[] = [];

  public Years: string[] = [];
  public selectedYear = '';
  public Categories: string[] = [];
  public selectedCategory = 'Todos los rubros';

  constructor(
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
          method: item.method,
        }));

        this.init();
      },
      error: (error) => {
        console.error(error)
      }
    });
    this.dataService.fetchIngresos('GET');
  }

  private init() {
    this.setYears(this.incomeData);
    this.globalFilter();
  }

  public globalFilter() {
    if (!this.incomeData.length) return;
    if (!this.selectedYear.length || !this.selectedCategory.length) return;
    this.filteredData = this.incomeData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.incomeData);
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.filteredData = this.filteredData.filter(entry => entry.category.startsWith(this.selectedCategory));
    const dataMap = new Map();
    this.filteredData.forEach((item) => {
      const method = item.method;
      dataMap.set(method, (dataMap.get(method) || 0) + 1);
    });

    this.chartLabels = Array.from(dataMap.keys());
    this.chartData = [{
      label: 'Ingresos',
      data: Array.from(dataMap.values())
    }];
  }

  private setYears(data: any) {
    if (!data) return;
    const years = new Set<string>();
    for (const entry of this.incomeData)
      years.add(entry.date.substring(0, 4));
    this.Years = Array.from(years);
    this.selectedYear = this.Years[0];
  }

  private setCategories(data: any) {
    if (!data) return;
    const filteredCategoriesSet = new Set<string>();
    for (const entry of data)
      filteredCategoriesSet.add(entry.category);
    filteredCategoriesSet.add('Todos los rubros');
    this.Categories = Array.from(filteredCategoriesSet);
  }
}

