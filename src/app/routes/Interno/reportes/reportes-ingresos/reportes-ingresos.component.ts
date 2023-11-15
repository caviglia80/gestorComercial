import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { reportesIngresos } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';

@Component({
  selector: 'app-reportes-ingresos',
  templateUrl: './reportes-ingresos.component.html',
  styleUrls: ['./reportes-ingresos.component.css']
})
export class ReportesIngresosComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<reportesIngresos>;
  public isLoading = true;
  public fechaDesde = ''
  public fechaHasta = ''

  public Columns: { [key: string]: string } = {
    id: 'ID',
    name: 'Nombre',
    cantidadIngresos: 'Cantidad de ingresos',
    totalIngresos: 'Total de ingresos',
    margenGanancias: 'Margen de ganancias'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService
  ) {
    this.fechaDesde = this.sharedService.obtenerFechaPrimerDiaDelMes();
    this.fechaHasta = this.sharedService.obtenerFechaUltimoDiaDelMes();
  }

  ngOnInit() {
    this.dataInit();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private dataInit() {
    this.dataService.ReporteIngreso$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchReporteIngreso(`?reporte=2&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
  }

  private loading(state: boolean) {
    this.isLoading = state;
  }

  public getColumnsKeys() {
    return Object.keys(this.Columns);
  }

  public searchFilter(filterValue: string) {
    filterValue = filterValue?.toString().toLowerCase().trim();
    this.dataSource.filter = filterValue ? filterValue : '';
  }

  public onFechaChange() {
    if (this.sharedService.isValidDate(this.fechaDesde) && this.sharedService.isValidDate(this.fechaHasta)) {
      this.cacheService.remove('ReporteIngreso')
      this.loading(true);
      this.dataService.fetchReporteIngreso(`?reporte=2&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
    }
  }
}
