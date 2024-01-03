import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Egreso, proveedor, empresa } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { FormControl, Validators } from '@angular/forms';
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
  public proveedorFiltered: Observable<any[]>;
  public proveedorData: proveedor[] = [];
  public dataSource = new MatTableDataSource<Egreso>;
  public isLoading = true;
  public create = false;
  public edit = false;
  public detail = false;

  public Item: any = {
    id: new FormControl(''),
    date: new FormControl('', Validators.required),
    moneda: new FormControl('', Validators.required),
    monto: new FormControl(0, [Validators.required, Validators.min(1)]),
    method: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    comprobante: new FormControl(''),
    description: new FormControl(''),
    beneficiario: new FormControl('', Validators.required)
  };

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
    this.proveedorFiltered = this.Item.beneficiario.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProveedor(value))
    );
  }

  async ngOnInit() {
    this.dataInit();
  }

  async ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data)
        this.dataEmpresa = data;
    });

    this.dataService.Egresos$.subscribe({
      next: (data) => {
        if (data) {
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

    this.dataService.Proveedores$.subscribe((data) => {
      this.proveedorData = data;
    });

    this.refresh();
  }

  private _filterProveedor(value: any): any[] {
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
    this.resetItemFormControls();
    this.detail = visible;
  }

  public Edit(visible: boolean) {
    this.resetItemFormControls();
    this.edit = visible;
  }

  public Create(visible: boolean) {
    this.resetItemFormControls();
    if (this.dataEmpresa.egresoRapidoEnabled === '1')
      Object.keys(this.Item).forEach(key => {
        this.Item[key].patchValue(this.sharedService.rellenoCampos_IE('e')[key] || '');
      });
    this.create = visible;
  }

  public viewItem(item: Egreso) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Egreso) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: Egreso) {
    this.dataService.fetchEgresos('DELETE', { id: item.id });
  }

  resetItemFormControls() {
    Object.keys(this.Item).forEach(key => {
      this.Item[key].reset();
    });
  }

  private rellenarRecord(item: any) {
    this.resetItemFormControls();
    Object.keys(this.Item).forEach(key => {
      this.Item[key].patchValue(item[key] || '');
    });
  }

  public record(method: string) {
    try {
      const body: Egreso = {
        id: this.Item.id.value,
        date: this.Item.date.value,
        moneda: this.Item.moneda.value,
        monto: this.Item.monto.value,
        method: this.Item.method.value,
        category: this.Item.category.value,
        comprobante: this.Item.comprobante.value,
        beneficiario: this.Item.beneficiario.value,
        description: this.Item.description.value
      };
      this.dataService.fetchEgresos(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
    }
  }

  public async refresh(force: boolean = false) {
    this.loading(true);
    this.dataService.fetchEmpresa('GET');
    if (force) this.cacheService.remove('Egresos');
    this.dataService.fetchEgresos('GET');
    this.dataService.fetchProveedores('GET');
  }

  async ExportToExcel() {
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






