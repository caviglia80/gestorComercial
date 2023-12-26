import { Component, ViewChild, OnInit, AfterViewInit, EventEmitter, Output  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { reportesEgresosRubro } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { FormControl } from '@angular/forms';
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
  public fechaDesde = new FormControl('');
  public fechaHasta = new FormControl('');

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
    this.fechaDesde.setValue(this.sharedService.obtenerFechaPrimerDiaDelMes());
    this.fechaHasta.setValue(this.sharedService.obtenerFechaUltimoDiaDelMes());
  }

  ngOnInit() {
    this.fechaDesde.valueChanges.subscribe(() => { this.onFechaChange(); });
    this.fechaHasta.valueChanges.subscribe(() => { this.onFechaChange(); });
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
    this.dataService.fetchReporteEgresoRubro(`?reporte=3&startd=${this.fechaDesde.value}&endd=${this.fechaHasta.value}`);
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
      this.cacheService.remove('ReporteEgresoRubro');
      this.loading(true);
      this.dataService.fetchReporteEgresoRubro(`?reporte=3&startd=${this.fechaDesde.value}&endd=${this.fechaHasta.value}`);
    }
  }
}
