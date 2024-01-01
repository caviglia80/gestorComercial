import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Ingreso, empresa } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-utilidad-bruta',
  templateUrl: './dashboard-grafico-utilidad-bruta.component.html',
  styleUrls: ['./dashboard-grafico-utilidad-bruta.component.css']
})
export class DashboardGraficoMargenComponent implements OnInit {
  public dataEmpresa: empresa | null = null;
  public loading: boolean = true;
  public chartTootilp = 'Representa la diferencia entre los ingresos totales generados por la venta de productos o servicios y el costo de los bienes o servicios vendidos. Utilidad Bruta = Ingresos Totales - Costo de Bienes o Servicios Vendidos';
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

    this.dataService.Ingresos$.subscribe({
      next: (data) => {
        data = data.filter(entry => entry.anulado.includes('0'));

        this.incomeData = data.map((item) => ({
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
  }

  private init() {
    this.setYears(this.incomeData);
    this.globalFilter();
  }

  private groupAndSumByMonth(data: any[]): any[] {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      data.push({ date: this.selectedYear + '-' + month + '-01', monto: 0 });
    });

    const groupedData: { [key: string]: any } = {};
    for (const entry of data) {
      const month = entry.date.substring(0, 7);
      const montot: number = parseFloat(entry.monto);
      const margen: number = parseFloat(entry.monto) !== 0 ? (montot - ((parseFloat(entry.margenBeneficio) / 2) * montot / 100)) : 0;

      if (groupedData[month]) {
        /* groupedData[month].total += parseFloat(entry.monto); */
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
    if (!this.dataEmpresa) return;
    if (!this.incomeData.length) return;
    if (!this.selectedYear.length || !this.selectedCategory.length) return;
    this.filteredData = this.incomeData.filter(entry => entry.date.startsWith(this.selectedYear));
    this.setCategories(this.incomeData);
    if (!this.selectedCategory.includes('Todos los rubros'))
      this.filteredData = this.filteredData.filter(entry => entry.category.startsWith(this.selectedCategory));
    this.groupedIncomeData = this.groupAndSumByMonth(this.filteredData);
    this.lineChartLabels = this.groupedIncomeData.map(item => item.month);
    /*     this.lineChartData = [{ data: this.groupedIncomeData.map(item => item.total), label: 'Ingresos' }]; */
    this.lineChartData = [{
      label: 'Utilidad Bruta',
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
