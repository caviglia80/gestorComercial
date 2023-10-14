import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { moneyIncome, moneyOutlays } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-margen-menos-egresos',
  templateUrl: './dashboard-grafico-margen-menos-egresos.component.html',
  styleUrls: ['./dashboard-grafico-margen-menos-egresos.component.css']
})
export class DashboardGraficoMargenMenosEgresosComponent implements OnInit {
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

  public IngresosFilteredData: any[] = [];
  public EgresosFilteredData: any[] = [];

  public ingresosData: moneyIncome[] = [];
  public egresosData: moneyOutlays[] = [];




  public groupedIncomeData: any[] = [];

  public Years: string[] = [];
  public selectedYear: string = '';
  public Categories: string[] = [];
  public selectedCategory: string = 'Todos los rubros';

  constructor(
    public dataService: DataService) { }

  ngOnInit() {
    this.IngresosDataInit();
    this.EgresosdataInit();
  }

  private IngresosDataInit() {
    this.dataService.Ingresos$.subscribe({
      next: (data) => {
        data = data.filter(entry => entry.anulado.includes('0'));
        this.ingresosData = data.map((item) => ({
          date: item.date,
          category: item.category,
          amount: item.amount,
          pvpPorcentaje: item.pvpPorcentaje,
        }));
        this.init();
      },
      error: (error) => {
        console.error(error)
      }
    });
  }

  private EgresosdataInit() {
    this.dataService.Egresos$.subscribe({
      next: (data) => {
        this.egresosData = data.map((item) => ({
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
    this.setYears(this.ingresosData, this.egresosData);
    this.globalFilter();
  }

  private groupAndSumByMonth(ingresosData: any[], egresosData: any[]): any[] {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      ingresosData.push({ date: this.selectedYear + '-' + month + '-01', amount: 0 });
    });
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      egresosData.push({ date: this.selectedYear + '-' + month + '-01', amount: 0 });
    });
    const groupedData: { [key: string]: any } = {};
    for (const entry of ingresosData) {
      const month = entry.date.substring(0, 7);
      const amountt: number = parseFloat(entry.amount);
      const margen: number = parseFloat(entry.amount) !== 0 ? (amountt - ((parseFloat(entry.pvpPorcentaje) / 2) * amountt / 100)) : 0;

      if (groupedData[month]) {
        groupedData[month].total += margen;
      } else {
        groupedData[month] = {
          month: month,
          total: margen,
        };
      }
    }

    for (const entry of egresosData) {
      const month = entry.date.substring(0, 7);
      const amount: number = parseFloat(entry.amount);
      if (groupedData[month]) {
        groupedData[month].total -= amount;
      } else {
        groupedData[month] = {
          month: month,
          total: -amount,
        };
      }
    }
    const sortedMonths = Object.keys(groupedData).sort();
    const orderedData = sortedMonths.map(month => groupedData[month]);
    return orderedData;
  }

  public globalFilter() {
    if (this.ingresosData.length + this.egresosData.length == 0) return;
    if (this.selectedYear.length === 0 || this.selectedCategory.length === 0) return;

    this.IngresosFilteredData = this.ingresosData.filter(entry => entry.date.startsWith(this.selectedYear));
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.IngresosFilteredData = this.IngresosFilteredData.filter(entry => entry.category.startsWith(this.selectedCategory));

    this.EgresosFilteredData = this.egresosData.filter(entry => entry.date.startsWith(this.selectedYear));
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.EgresosFilteredData = this.EgresosFilteredData.filter(entry => entry.category.startsWith(this.selectedCategory));

    this.setCategories(this.IngresosFilteredData, this.EgresosFilteredData);

    this.groupedIncomeData = this.groupAndSumByMonth(this.IngresosFilteredData, this.EgresosFilteredData);
    this.lineChartLabels = this.groupedIncomeData.map(item => item.month);

    this.lineChartData = [{
      label: 'Margen-Egresos',
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

  private setYears(data1: any, data2: any) {
    if (data1.length + data2.length == 0) return;
    const years = new Set<string>();
    for (const entry of data1)
      years.add(entry.date.substring(0, 4));
    for (const entry of data2)
      years.add(entry.date.substring(0, 4));
    this.Years = Array.from(years);
    this.selectedYear = this.Years[0];
  }

  private setCategories(data1: any, data2: any) {
    if (data1.length + data2.length == 0) return;
    const filteredCategoriesSet = new Set<string>();
    for (const entry of data1)
      filteredCategoriesSet.add(entry.category);
    for (const entry of data2)
      filteredCategoriesSet.add(entry.category);
    filteredCategoriesSet.add('Todos los rubros');
    this.Categories = Array.from(filteredCategoriesSet);

    this.selectedCategory = this.Categories[this.Categories.length - 1];
  }
}
