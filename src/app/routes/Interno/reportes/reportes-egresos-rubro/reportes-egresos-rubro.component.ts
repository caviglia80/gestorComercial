import { Component, ViewChild, OnInit, AfterViewInit, EventEmitter, Output  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { reportesEgresosRubro } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';

@Component({
  selector: 'app-reportes-egresos-rubro',
  templateUrl: './reportes-egresos-rubro.component.html',
  styleUrls: ['./reportes-egresos-rubro.component.css']
})
export class ReportesEgresosRubroComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataSource = new MatTableDataSource<reportesEgresosRubro>;
  @Output() variableChange = new EventEmitter<MatTableDataSource<reportesEgresosRubro>>();

  public isLoading = true;
  public fechaDesde = ''
  public fechaHasta = ''

  public Columns: { [key: string]: string } = {
    rubro: 'Rubro',
    cantidadEgresos: 'Cantidad de Egresos',
    montoTotalEgresos: 'Monto Total'
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


  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private dataInit() {
    this.dataService.ReporteEgresoRubro$.subscribe({
      next: (data) => {
        if (data && data.length) {
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
    this.dataService.fetchReporteEgresoRubro(`?reporte=3&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
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
      this.cacheService.remove('ReporteEgresoRubro');
      this.loading(true);
      this.dataService.fetchReporteEgresoRubro(`?reporte=3&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
    }
  }
}
