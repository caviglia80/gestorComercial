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

  chartData: any[] = [];
  chartLabels: LabelItem[] = [];
  chartType: ChartType = 'pie';

  public incomeData: moneyIncome[] = [];
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
  }

  private init() {
    this.setYears(this.incomeData);
    this.globalFilter();
  }

  public globalFilter() {
    if (this.incomeData.length == 0) return;
    if (this.selectedYear.length === 0 || this.selectedCategory.length === 0) return;
    this.filteredData = this.incomeData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.filteredData);
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
    if (data.length == 0) return;
    const years = new Set<string>();
    for (const entry of this.incomeData) {
      years.add(entry.date.substring(0, 4));
    }
    this.Years = Array.from(years);
    this.selectedYear = this.Years[0];
  }

  private setCategories(data: any) {
    if (data.length == 0) return;
    const filteredCategoriesSet = new Set<string>();
    for (const entry of data)
      filteredCategoriesSet.add(entry.category);
    this.Categories = Array.from(filteredCategoriesSet);
    if (!this.Categories.includes('Todos los rubros'))
      this.Categories.push('Todos los rubros');




  }


}

