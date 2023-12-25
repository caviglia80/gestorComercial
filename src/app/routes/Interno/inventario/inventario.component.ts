import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, Inventario, proveedor } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})

export class inventarioComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataEmpresa: empresa = new empresa();
  public proveedorFiltered: Observable<any[]>;
  public proveedorData: proveedor[] = [];
  public dataSource = new MatTableDataSource<Inventario>;
  public isLoading = true;
  public create = false;
  public edit = false;
  public double = false;
  public detail = false;

  public Item: any = {
    id: new FormControl(''),
    idExterno: new FormControl(''),
    nombre: new FormControl('', Validators.required),
    existencias: new FormControl(0),
    costo: new FormControl(0),
    margenBeneficio: new FormControl(0),
    tipo: new FormControl('', Validators.required),
    proveedor: new FormControl(''),
    duracion: new FormControl(''),
    categoria: new FormControl(''),
    descripcion: new FormControl('')
  };

  public Columns: { [key: string]: string } = {
    id: 'ID',
    idExterno: 'ID Externo',
    nombre: 'Nombre',
    tipo: 'Tipo',
    listPrice: 'Precio lista',
    /*     existencias: 'Existencias', */
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService
  ) {
    this.proveedorFiltered = this.Item.proveedor.valueChanges.pipe(
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

    this.dataService.Inventario$.subscribe({
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
    this.dataService.fetchInventario('GET');

    this.dataService.Proveedores$.subscribe((data) => {
      this.proveedorData = data;
    });
    this.getProveedor();
  }

  public getProveedor() {
    this.dataService.fetchProveedores('GET');
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

  public Double(visible: boolean) {
    this.resetItemFormControls();
    this.double = visible;
  }

  public Create(visible: boolean) {
    this.resetItemFormControls();
    this.create = visible;
  }

  public viewItem(item: Inventario) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Inventario) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public duplicateItem(item: Inventario) {
    this.Double(true);
    const originalExternalID: string = item.idExterno ? item.idExterno : "";
    item.idExterno = 'Duplicado - ' + item.idExterno;
    this.rellenarRecord(item);
    item.idExterno = originalExternalID;
  }

  public deleteItem(item: Inventario) {
    this.dataService.fetchInventario('DELETE', { id: item.id, nombre: item.nombre });
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
      const body: Inventario = {
        id: this.Item.id.value,
        empresaId: this.dataEmpresa.id,
        idExterno: this.Item.idExterno.value,
        nombre: this.Item.nombre.value,
        existencias: this.Item.existencias.value ? this.Item.existencias.value : 0,
        costo: this.Item.costo.value ? this.Item.costo.value : 0,
        margenBeneficio: this.Item.margenBeneficio.value ? this.Item.margenBeneficio.value : 0,
        tipo: this.Item.tipo.value,
        proveedor: this.Item.proveedor.value,
        duracion: this.Item.duracion.value,
        categoria: this.Item.categoria.value,
        descripcion: this.Item.descripcion.value
      };
      this.dataService.fetchInventario(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
      this.Double(false);
    }
  }

  refresh() {
    this.loading(true);
    this.cacheService.remove('Inventario');
    this.dataService.fetchInventario('GET');
    this.getProveedor();
  }

  ExportToExcel() {
    const columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'ID Externo', key: 'idExterno', width: 20 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Existencias', key: 'existencias', width: 15 },
      { header: 'Costo', key: 'costo', width: 15 },
      { header: 'Margen de Beneficio', key: 'margenBeneficio', width: 20 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Proveedor', key: 'proveedor', width: 20 },
      { header: 'Duración', key: 'duracion', width: 15 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Descripción', key: 'descripcion', width: 25 }
    ];
    this.excelExportService.exportToExcel(columns, this.dataSource.data, 'Inventario');
  }
}





