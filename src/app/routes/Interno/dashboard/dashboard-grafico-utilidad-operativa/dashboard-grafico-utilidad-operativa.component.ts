import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Ingreso, Egreso, empresa } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-utilidad-operativa',
  templateUrl: './dashboard-grafico-utilidad-operativa.component.html',
  styleUrls: ['./dashboard-grafico-utilidad-operativa.component.css']
})
export class DashboardGraficoMargenMenosEgresosComponent implements OnInit {
  public dataEmpresa: empresa | null = null;
  public loading: boolean = true;
  public chartTootilp = 'Ingresos Totales: son todos los ingresos generados por las ventas de productos o servicios. Costos Operativos: incluyen todos los gastos directamente relacionados con las operaciones del negocio. Utilidad Operativa = Ingresos Totales - Costos Operativos';
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

  public ingresosData: Ingreso[] = [];
  public egresosData: Egreso[] = [];

  public IngresosFilteredData: any[] = [];
  public EgresosFilteredData: any[] = [];

  public groupedIncomeData: any[] = [];

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
        this.ingresosData = data.map((item) => ({
          date: item.date,
          category: item.category,
          monto: item.monto,
          margenBeneficio: item.margenBeneficio ? item.margenBeneficio : 0,
        }));
        this.init();
      },
      error: (error) => {
        console.error(error)
      }
    });
    this.dataService.fetchIngresos('GET');

    this.dataService.Egresos$.subscribe({
      next: (data) => {
        this.egresosData = data.map((item) => ({
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
    this.dataService.fetchEgresos('GET');
  }

  private init() {
    this.setYears(this.ingresosData);
    this.setYears(this.egresosData);
    this.globalFilter();
  }

  private groupAndSumByMonth(ingresosData: any[], egresosData: any[]): any[] {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      ingresosData.push({ date: this.selectedYear + '-' + month + '-01', monto: 0 });
    });
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      egresosData.push({ date: this.selectedYear + '-' + month + '-01', monto: 0 });
    });
    const groupedData: { [key: string]: any } = {};
    for (const entry of ingresosData) {
      const month = entry.date.substring(0, 7);
      const montot: number = parseFloat(entry.monto);
      const margen: number = parseFloat(entry.monto) !== 0 ? (montot - ((parseFloat(entry.margenBeneficio) / 2) * montot / 100)) : 0;

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
      const monto: number = parseFloat(entry.monto);
      if (groupedData[month]) {
        groupedData[month].total -= monto;
      } else {
        groupedData[month] = {
          month: month,
          total: -monto,
        };
      }
    }
    const sortedMonths = Object.keys(groupedData).sort();
    const orderedData = sortedMonths.map(month => groupedData[month]);
    return orderedData;
  }

  public globalFilter() {
    if (!this.dataEmpresa) return;
    if (!this.ingresosData.length || !this.egresosData.length) return;
    if (!this.selectedYear.length || !this.selectedCategory.length) return;

    this.IngresosFilteredData = this.ingresosData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.ingresosData);
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.IngresosFilteredData = this.IngresosFilteredData.filter(entry => entry.category.startsWith(this.selectedCategory));

    this.EgresosFilteredData = this.egresosData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.egresosData);
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.EgresosFilteredData = this.EgresosFilteredData.filter(entry => entry.category.startsWith(this.selectedCategory));

    this.groupedIncomeData = this.groupAndSumByMonth(this.IngresosFilteredData, this.EgresosFilteredData);
    this.lineChartLabels = this.groupedIncomeData.map(item => item.month);

    this.lineChartData = [{
      label: 'Utilidad Operativa',
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
    for (const entry of data)
      years.add(entry.date.substring(0, 4));
    for (const entry of this.Years)
      years.add(entry);
    this.Years = Array.from(years);
    this.selectedYear = this.Years[0];
  }

  private setCategories(data: any) {
    if (!data) return;
    const filteredCategoriesSet = new Set<string>();
    for (const entry of data)
      filteredCategoriesSet.add(entry.category);
    for (const entry of this.Categories)
      filteredCategoriesSet.add(entry);
    filteredCategoriesSet.add('Todos los rubros');
    this.Categories = Array.from(filteredCategoriesSet);
  }
}
