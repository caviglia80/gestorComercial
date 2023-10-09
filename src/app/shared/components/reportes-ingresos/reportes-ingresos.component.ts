import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { reportesIngresos } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-reportes-ingresos',
  templateUrl: './reportes-ingresos.component.html',
  styleUrls: ['./reportes-ingresos.component.css']
})
export class ReportesIngresosComponent {
  public dataSource = new MatTableDataSource<reportesIngresos>;
  public isLoading: boolean = true;
  public fechaDesde: string = ''
  public fechaHasta: string = ''

  public Columns: { [key: string]: string } = {
    id: 'ID',
    name: 'Nombre de producto',
    cantidadIngresos: 'Cantidad de ingresos',
    totalIngresos: 'Total de ingresos',
    margenGanancias: 'Margen de ganancias'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    public sharedService: SharedService
  ) {
    this.fechaDesde = this.sharedService.obtenerFechaPrimerDiaDelMes();
    this.fechaHasta = this.sharedService.obtenerFechaUltimoDiaDelMes();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataInit();
  }

  private dataInit() {
    this.dataService.reportesIngresos$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchReportes('GET', `?reporte=2&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
  }

  private loading(state: boolean) {
    this.isLoading = state;
    this.cdr.detectChanges();
  }

  public getColumnsKeys() {
    return Object.keys(this.Columns);
  }

  public searchFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue === '' ? '' : filterValue;
  }

  public onFechaChange() {
    if (this.sharedService.isValidDate(this.fechaDesde) && this.sharedService.isValidDate(this.fechaHasta)) {
      this.loading(true);
      this.dataService.fetchReportes('GET', `?reporte=2&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
    }

  }
}
