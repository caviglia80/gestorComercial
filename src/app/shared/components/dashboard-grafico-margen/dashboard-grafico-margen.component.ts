import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { moneyIncome, configuracion } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-dashboard-grafico-margen',
  templateUrl: './dashboard-grafico-margen.component.html',
  styleUrls: ['./dashboard-grafico-margen.component.css']
})
export class DashboardGraficoMargenComponent implements OnInit {
  public chartTootilp = 'Representa la diferencia entre los ingresos totales generados por la venta de productos o servicios y el costo de los bienes o servicios vendidos. Utilidad Bruta = Ingresos Totales - Costo de Bienes o Servicios Vendidos';
  private currentConfiguracion: configuracion = new configuracion();
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

  public incomeData: moneyIncome[] = [];
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
    this.dataService.Configuracion$.subscribe((data) => {
      this.currentConfiguracion = data[0];
    });
    this.dataService.fetchConfiguracion('GET');

    this.dataService.Ingresos$.subscribe({
      next: (data) => {
        data = data.filter(entry => entry.anulado.includes('0'));

        this.incomeData = data.map((item) => ({
          date: item.date,
          category: item.category,
          amount: item.amount,
          margenBeneficio: item.margenBeneficio ? item.margenBeneficio : 0,
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

  private groupAndSumByMonth(data: any[]): any[] {
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].forEach(month => {
      data.push({ date: this.selectedYear + '-' + month + '-01', amount: 0 });
    });
    const groupedData: { [key: string]: any } = {};
    for (const entry of data) {
      const month = entry.date.substring(0, 7);
      const amountt: number = parseFloat(entry.amount);
      const margen: number = parseFloat(entry.amount) !== 0 ? (amountt - ((parseFloat(entry.margenBeneficio) / 2) * amountt / 100)) : 0;

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
      backgroundColor: this.currentConfiguracion.color2 ? this.currentConfiguracion.color2 : 'transparent',
      borderColor: this.currentConfiguracion.color1 ? this.currentConfiguracion.color1 : 'transparent',
      pointBackgroundColor: this.currentConfiguracion.color2 ? this.currentConfiguracion.color2 : 'transparent',
      pointBorderColor: this.currentConfiguracion.color1 ? this.currentConfiguracion.color1 : 'transparent',
      pointRadius: 2,
      fill: false,
      lineTension: 0.1,
      borderWidth: 2,
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
