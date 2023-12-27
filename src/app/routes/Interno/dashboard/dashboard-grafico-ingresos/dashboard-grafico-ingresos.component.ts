import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Ingreso, empresa } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-ingresos',
  templateUrl: './dashboard-grafico-ingresos.component.html',
  styleUrls: ['./dashboard-grafico-ingresos.component.css']
})
export class DashboardGraficoIngresosComponent implements OnInit {
  public dataEmpresa: empresa | null = null;
  public loading: boolean = true;
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

  public incomeData: Ingreso[] = [];
  public groupedIncomeData: any[] = [];
  public filteredData: any[] = [];

  public Years: string[] = [];
  public selectedYear = '';
  public Categories: string[] = [];
  public selectedCategory = 'Todos los rubros';

  constructor(
    public dataService: DataService) {
  }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data)
        this.dataEmpresa = data;
    });
    this.dataService.fetchEmpresa('GET');

    this.dataService.Ingresos$.subscribe({
      next: (data) => {

        data = data.filter(entry => entry.anulado.includes('0'));

        this.incomeData = data.map((item) => ({
          date: item.date,
          category: item.category,
          monto: item.monto,
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

  /* doughnut pie line */
  private groupAndSumByMonth(data: any[]): any[] {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      data.push({ date: this.selectedYear + '-' + month + '-01', monto: 0 });
    });
    const groupedData: { [key: string]: any } = {};
    for (const entry of data) {
      const month = entry.date.substring(0, 7);
      if (groupedData[month]) {
        groupedData[month].total += parseFloat(entry.monto);
      } else {
        groupedData[month] = {
          month: month,
          total: parseFloat(entry.monto)
        };
      }
    }
    const sortedMonths = Object.keys(groupedData).sort();
    const orderedData = sortedMonths.map(month => groupedData[month]);
    return orderedData;
  }

  public globalFilter() {
    if (!this.dataEmpresa) return;
    if (!this.incomeData.length) return;
    if (!this.selectedYear.length || !this.selectedCategory.length) return;
    this.filteredData = this.incomeData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.incomeData);
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.filteredData = this.filteredData.filter(entry => entry.category.startsWith(this.selectedCategory));
    this.groupedIncomeData = this.groupAndSumByMonth(this.filteredData);
    this.lineChartLabels = this.groupedIncomeData.map(item => item.month);
    this.lineChartData = [{
      label: 'Ingresos',
      data: this.groupedIncomeData.map(item => item.total),
      backgroundColor: this.dataEmpresa.color2 || 'transparent',
      borderColor: this.dataEmpresa.color1 || 'transparent',
      pointBackgroundColor: this.dataEmpresa.color2 || 'transparent',
      pointBorderColor: this.dataEmpresa.color1 || 'transparent',
      pointRadius: 2,
      fill: false,
      lineTension: 0.1,
      borderWidth: 2,
    }];
    this.loading = false;
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
