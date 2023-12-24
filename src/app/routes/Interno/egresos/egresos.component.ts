import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { moneyOutlays, proveedor, empresa } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})

export class EgresosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataEmpresa: empresa = new empresa();
  public proveedorControl = new FormControl();
  public proveedorFiltered: Observable<any[]>;
  public proveedorData: proveedor[] = [];
  public dataSource = new MatTableDataSource<moneyOutlays>;
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public detail = false;
  /*   private currentEmpresa: any; */

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    beneficiario: 'Beneficiario',
    /*     moneda: 'Moneda', */
    category: 'Rubro',
    monto: 'Monto',
    /*     method: 'Método de Gasto', */
    /*     comprobante: 'Comprobante', */
    /*     description: 'Descripción', */
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService
  ) {
    this.proveedorFiltered = this.proveedorControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProveedor(value))
    );
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
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0])
        this.dataEmpresa = data[0];
    });
    this.dataService.fetchEmpresa('GET');

    this.dataService.Egresos$.subscribe({
      next: (data) => {
        if (data && data.length) {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.loading(true);
    this.dataService.fetchEgresos('GET');

    this.dataService.Proveedores$.subscribe((data) => {
      this.proveedorData = data;
    });
    this.getProveedor();
  }

  private _filterProveedor(value: string): any[] {
    this.getProveedor();
    if (value) {
      const filterValue = value?.toString().toLowerCase();
      if (filterValue)
        return this.proveedorData.filter(item =>
          item.company?.toString().toLowerCase().includes(filterValue) ||
          item.contactFullname?.toString().toLowerCase().includes(filterValue)
        );
      else return [];
    } else return [];
  }

  public getProveedor() {
    this.dataService.fetchProveedores('GET');
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

  public Detail(visible: boolean) {
    this.Item = {};
    this.detail = visible;
  }

  public Edit(visible: boolean) {
    this.Item = {};
    this.edit = visible;
  }

  public Create(visible: boolean) {
    this.Item = {};
    if (this.dataEmpresa.egresoRapidoEnabled === '1')
      this.Item = this.sharedService.rellenoCampos_IE('e');
    this.create = visible;
  }

  public viewItem(item: moneyOutlays) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: moneyOutlays) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: moneyOutlays) {
    this.dataService.fetchEgresos('DELETE', { id: item.id });
  }

  private rellenarRecord(item: moneyOutlays) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.date = item.date;
    this.Item.moneda = item.moneda;
    this.Item.monto = item.monto;
    this.Item.method = item.method;
    this.Item.category = item.category;
    this.Item.comprobante = item.comprobante;
    this.Item.beneficiario = item.beneficiario;
    this.Item.description = item.description;
  }

  public record(method: string) {
    try {
      const body: moneyOutlays = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        date: this.Item.date,
        moneda: this.Item.moneda,
        monto: this.Item.monto,
        method: this.Item.method,
        category: this.Item.category,
        comprobante: this.Item.comprobante,
        beneficiario: this.Item.beneficiario,
        description: this.Item.description
      };
      this.dataService.fetchEgresos(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
    }
  }

  refresh() {
     this.loading(true);
    this.cacheService.remove('Egresos');
    this.dataService.fetchEgresos('GET');
    this.getProveedor();
  }

  ExportToExcel() {
    const columns = [
      { header: 'Fecha', key: 'date', width: 15 },
      { header: 'Moneda', key: 'moneda', width: 15 },
      { header: 'Monto', key: 'monto', width: 15 },
      { header: 'Método', key: 'method', width: 15 },
      { header: 'Categoría', key: 'category', width: 20 },
      { header: 'Comprobante', key: 'comprobante', width: 20 },
      { header: 'Beneficiario', key: 'beneficiario', width: 20 },
      { header: 'Descripción', key: 'description', width: 25 }
    ];
    this.excelExportService.exportToExcel(columns, this.dataSource.data, 'Egresos');
  }
}






