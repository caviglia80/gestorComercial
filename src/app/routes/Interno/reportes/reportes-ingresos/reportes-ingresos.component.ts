import { Component, ViewChild, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { reportesIngresos } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-reportes-ingresos',
  templateUrl: './reportes-ingresos.component.html',
  styleUrls: ['./reportes-ingresos.component.css']
})
export class ReportesIngresosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataSource = new MatTableDataSource<reportesIngresos>;
  @Output() variableChange = new EventEmitter<MatTableDataSource<reportesIngresos>>();

  public isLoading = true;
  public fechaDesde = new FormControl('');
  public fechaHasta = new FormControl('');

  public Columns: { [key: string]: string } = {
    id: 'ID Inventario',
    name: 'Nombre Inventario',
    cantidadIngresos: 'Cantidad Ingresos',
    totalIngresos: 'Total Ingresos',
    margenGanancias: 'Margen Ganancias'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService
  ) {
    this.fechaDesde.setValue(this.sharedService.obtenerFechaPrimerDiaDelMes());
    this.fechaHasta.setValue(this.sharedService.obtenerFechaUltimoDiaDelMes());
  }

  async ngOnInit() {
    this.fechaDesde.valueChanges.subscribe(() => { this.onFechaChange(); });
    this.fechaHasta.valueChanges.subscribe(() => { this.onFechaChange(); });
    this.dataInit();
  }

  async ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private dataInit() {
    this.dataService.ReporteIngreso$.subscribe({
      next: (data) => {
        if (data) {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.variableChange.emit(this.dataSource);
        }
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.loading(true);
    this.dataService.fetchReporteIngreso(`?reporte=2&startd=${this.fechaDesde.value}&endd=${this.fechaHasta.value}`);
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
    if (this.sharedService.isValidDate(this.fechaDesde.value!) && this.sharedService.isValidDate(this.fechaHasta.value!)) {
      this.cacheService.remove('ReporteIngreso')
      this.loading(true);
      this.dataService.fetchReporteIngreso(`?reporte=2&startd=${this.fechaDesde.value}&endd=${this.fechaHasta.value}`);
    }
  }
}
