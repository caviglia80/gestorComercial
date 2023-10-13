import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { SharedService } from '@services/shared/shared.service';
import { moneyIncome, moneyOutlays } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-margen-menos-egresos',
  templateUrl: './dashboard-grafico-margen-menos-egresos.component.html',
  styleUrls: ['./dashboard-grafico-margen-menos-egresos.component.css']
})
export class DashboardGraficoMargenMenosEgresosComponent implements OnInit {
  public ingresosData: moneyIncome[] = [];
  public egresosData: moneyOutlays[] = [];
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

  public IngresosFilteredData: any[] = [];
  public EgresosFilteredData: any[] = [];
  public availableYears: string[] = [];
  public selectedYear: string = this.availableYears[0];
  public Categories: string[] = [];
  public selectedCategory: string = 'Todos los rubros';

  constructor(
    public sharedService: SharedService,
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
        this.inicioUnico();
      },
      error: (error) => {
        console.error(error)
      }
    });
    this.dataService.fetchIngresos('GET');
  }

  private EgresosdataInit() {
    this.dataService.Egresos$.subscribe({
      next: (data) => {
        this.egresosData = data.map((item) => ({
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
    this.dataService.fetchEgresos('GET');
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
    if (this.ingresosData.length + this.egresosData.length == 0) return [];
    const years = new Set<string>();
    for (const entry of this.ingresosData) {
      const year = entry.date.substring(0, 4);
      years.add(year);
    }
    for (const entry of this.egresosData) {
      const year = entry.date.substring(0, 4);
      years.add(year);
    }
    return Array.from(years);
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
    this.availableYears = this.getAvailableYears();
    if (this.selectedYear.length === 0 || this.selectedCategory.length === 0) return;

    this.IngresosFilteredData = this.ingresosData.filter(entry => entry.date.startsWith(this.selectedYear));
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.IngresosFilteredData = this.IngresosFilteredData.filter(entry => entry.category.startsWith(this.selectedCategory));

    this.EgresosFilteredData = this.egresosData.filter(entry => entry.date.startsWith(this.selectedYear));
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.EgresosFilteredData = this.EgresosFilteredData.filter(entry => entry.category.startsWith(this.selectedCategory));

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
}
