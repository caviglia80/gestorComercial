import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SharedService } from '@services/shared/shared.service';
import { moneyIncome } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-margen',
  templateUrl: './dashboard-grafico-margen.component.html',
  styleUrls: ['./dashboard-grafico-margen.component.css']
})
export class DashboardGraficoMargenComponent implements OnInit {
  public incomeData: moneyIncome[] = [];
  public groupedIncomeData: any[] = [];
  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
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

  constructor(
    public sharedService: SharedService,
    public dataService: DataService) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Ingresos$.subscribe({
      next: (data) => {
        data = data.filter(entry => entry.anulado.includes('0'));

        this.incomeData = data.map((item) => ({
          date: item.date,
          category: item.category,
          amount: item.amount,
          pvpPorcentaje: item.pvpPorcentaje,
        }));

        /*    console.log(this.incomeData); */

        this.inicioUnico();
      },
      error: (error) => {
        console.error(error)
      }
    });
    this.dataService.fetchIngresos('GET');
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
      const amountt: number = parseFloat(entry.amount);
      const margen: number = parseFloat(entry.amount) !== 0 ? (amountt - ((parseFloat(entry.pvpPorcentaje) / 2) * amountt / 100)) : 0;

      if (groupedData[month]) {
        /* groupedData[month].total += parseFloat(entry.amount); */
        groupedData[month].total += margen;
      } else {
        groupedData[month] = {
          month: month,
          total: margen,
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
      label: 'Margen',
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
}
