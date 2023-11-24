import { Component, ViewChild, OnInit, AfterViewInit, EventEmitter, Output  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { reportesEgresosBP } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';

@Component({
  selector: 'app-reportes-egresos-bp',
  templateUrl: './reportes-egresos-bp.component.html',
  styleUrls: ['./reportes-egresos-bp.component.css']
})
export class ReportesEgresosBPComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<reportesEgresosBP>;
  @Output() variableChange = new EventEmitter<MatTableDataSource<reportesEgresosBP>>();

  public isLoading = true;
  public fechaDesde = ''
  public fechaHasta = ''

  public Columns: { [key: string]: string } = {
    bp: 'Beneficiario',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private dataInit() {
    this.dataService.ReporteEgresoBP$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.variableChange.emit(this.dataSource);
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchReporteEgresoBP(`?reporte=4&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
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
      this.cacheService.remove('ReporteEgresoBP');
      this.loading(true);
      this.dataService.fetchReporteEgresoBP(`?reporte=4&startd=${this.fechaDesde}&endd=${this.fechaHasta}`);
    }
  }
}
