import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { startWith, map } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CacheService } from '@services/cache/cache.service';
import { empresa, Ingreso, Inventario } from '@models/mainClasses/main-classes';
import { Remito } from '@models/remito/remito';
import { ExcelExportService } from '@services/excel-export/excel-export.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})

export class IngresosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataEmpresa: empresa = new empresa();
  public filteredInventario: Observable<any[]>;
  public dataSource = new MatTableDataSource<Ingreso>;
  public dataInventario: Inventario[] = [];
  public isLoading = true;
  public create = false;
  public edit = false;
  public detail = false;
  public remito = false;
  public itemRemito: Ingreso[] = [];
  public R: Remito = new Remito();
  public errorMsg = '';

  public Item: any = {
    id: new FormControl(0),
    inventarioId: new FormControl(0),
    nombre: new FormControl(''),
    date: new FormControl('', Validators.required),
    cliente: new FormControl(''),
    moneda: new FormControl(''),
    monto: new FormControl(0, [Validators.required, Validators.min(1)]),
    costo: new FormControl(0),
    margenBeneficio: new FormControl(''),
    method: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    comprobante: new FormControl(''),
    anulado: new FormControl(''),
    tipo: new FormControl(''),
    description: new FormControl('')
  };

  resetItemFormControls() {
    Object.keys(this.Item).forEach(key => {
      this.Item[key].reset();
    });
  }

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    nombre: 'Nombre',
    // inventarioId: 'Inventario',
    cliente: 'Cliente',
    monto: 'Monto',
    /*     method: 'Método de Pago', */
    category: 'Rubro',
    /*     comprobante: 'Comprobante', */
    /*     margenBeneficio: 'PVP', */
    /*     description: 'Descripción', */
    anulado: 'Anulado',
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService
  ) {
    this.filteredInventario = this.Item.nombre.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value))
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

    this.dataService.Ingresos$.subscribe({
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

    this.dataService.Inventario$.subscribe((data) => {
      this.dataInventario = data || [];
    });

    this.refresh();
  }

  public onProductoSeleccionado(event: any): void {
    const inventario: Inventario = this._getProduct(event.option.value!.split(' - ')[0]);

    if (inventario) {
      if (inventario.tipo === 'Producto') {
        if (this.dataEmpresa.permitirStockCeroEnabled == '1') {
          this.Item.monto.setValue(this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio));
        } else {
          if (inventario.existencias != 0) {
            this.Item.monto.setValue(this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio));
          } else {
            this.sharedService.message('Advertencia: el producto no tiene stock');
            this.Item.monto.setValue(0);
            this.Item.nombre.reset();
          }
        }
        this.Item.margenBeneficio.setValue(inventario.margenBeneficio);
      } else {
        this.Item.monto.setValue(this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio));
      }
      this.Item.inventarioId.setValue(inventario.id);
      this.Item.nombre.setValue(inventario.nombre || '');
    } else {
      this.Item.inventarioId.setValue(null);
      this.Item.nombre.setValue(event.option.value);
    }
  }

  private _filterProduct(value: any): Inventario[] {
    this.getInventario();
    if (value != null) {
      const filterValue = value?.toString().toLowerCase();
      return this.dataInventario.filter(item =>
        item.nombre?.toString().toLowerCase().includes(filterValue) ||
        item.id?.toString().toLowerCase().includes(filterValue) ||
        item.idExterno?.toString().toLowerCase().includes(filterValue)
      );
    } else return [];
  }

  public _getProduct(inventarioId: any): Inventario {
    this.getInventario();
    if (inventarioId)
      return this.dataInventario.filter(item =>
        item.id?.toString().toLowerCase() === inventarioId?.toString().toLowerCase()
      )[0];
    else return null!;
  }

  public getInventario() {
    this.dataService.fetchInventario('GET');
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

  public viewItem(item: Ingreso) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Ingreso) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: Ingreso) {
    this.dataService.fetchIngresos('DELETE', { id: item.id });
  }

  public Remito(visible: boolean) {
    if (visible) {
      this.R = this.R.getRemito(this.itemRemito, this.dataInventario);
    } else {
      this.R = new Remito();
      this.itemRemito = [];
      this.resetItemFormControls();
    }
    this.remito = visible;
  }

  public async anularItem(item: Ingreso) {
    item.anulado = '1';
    this.dataService.fetchIngresos('PUT', item);
    if (this.dataEmpresa.ingresoAnuladoSumaStockEnabled == '1' && this.dataEmpresa.validarInventarioEnabled == '1')
      this.sumarStock(this._getProduct(item.inventarioId));
  }

  private rellenarRecord(item: any) {
    this.resetItemFormControls();
    Object.keys(this.Item).forEach(key => {
      if (key === 'inventarioId')
        this.Item[key].patchValue(this.dataInventario.find(i => i.id == item.inventarioId)?.id || '');
      else if (key === 'tipo')
        this.Item[key].patchValue(this.dataInventario.find(i => i.id == item.inventarioId)?.tipo || '');
      // else if (key === 'costo')
      //   this.Item[key].patchValue(this.dataInventario.find(i => i.id == item.inventarioId)?.costo || '');
      else
        this.Item[key].patchValue(item[key] || '');
    });


    console.log(this.Item);
  }

  private async restarStock(inventario: Inventario[]) {
    if (inventario.length > 0) {
      inventario.forEach(item => {
        if (item && item.tipo === 'Producto') {
          let existenciasCount: number = item.existencias ? item.existencias : 0;
          if (existenciasCount > 0) {
            existenciasCount--;
            item.existencias = existenciasCount;
            this.dataService.fetchInventario('PUT', { id: item.id, existencias: existenciasCount });
            this.sharedService.message('Se descontó una unidad del stock.');
            if (!SharedService.isProduction) console.log('(' + item.id + ') existencia restada a ' + existenciasCount);
          } else {
            this.sharedService.message('Advertencia: no hay stock para descontar.');
          }
        } else {
          this.sharedService.message('Advertencia: no se localizó el ID del producto.');
        }
      });
    } else {
      this.sharedService.message('Advertencia: no hay productos.');
    }
  }

  private productoValido(): boolean {
    if (!this._getProduct(this.Item.inventarioId.value)) {
      this.sharedService.message('Advertencia: seleccione un producto válido.');
      this.Item.monto.setValue(0);
      this.Item.costo.setValue(0);
      this.Item.inventarioId.reset();
      return false;
    }
    return true;
  }

  private async sumarStock(inventario: Inventario) {
    if (inventario) {
      if (inventario.tipo === 'Producto') {
        let existenciasCount: number = inventario.existencias ? inventario.existencias : 0;
        existenciasCount++;
        this.dataService.fetchInventario('PUT', { id: inventario.id, existencias: existenciasCount });
        this.sharedService.message('Se sumó una unidad al stock.');
      }
    } else {
      this.sharedService.message('Advertencia: no se localizó el ID del producto.');
    }
  }

  public async refresh(force: boolean = false) {
    this.loading(true);
    this.dataService.fetchEmpresa('GET');
    if (force) this.cacheService.remove('Ingresos');
    await this.dataService.fetchIngresos('GET');
    this.getInventario();
  }

  public async recordEdit() {
    let response: any;
    try {
      const i = this._getProduct(this.Item.inventarioId.value);

      this.Item.inventarioId.setValue((this.dataInventario.find(i => i.nombre == this.Item.nombre.value)?.id === this.Item.inventarioId.value) ? this.Item.inventarioId.value : null);
      this.Item.costo.setValue(i.costo ? i.costo : 0);

      const body: Ingreso = {
        id: this.Item.id.value,
        date: this.Item.date.value,
        inventarioId: this.Item.inventarioId.value,
        nombre: this.Item.nombre.value,
        moneda: this.Item.moneda.value,
        monto: this.Item.monto.value,
        costo: this.Item.costo.value,
        margenBeneficio: this.Item.margenBeneficio.value,
        method: this.Item.method.value,
        category: this.Item.category.value,
        comprobante: this.Item.comprobante.value,
        anulado: this.Item.anulado.value,
        cliente: this.Item.cliente.value,
        description: this.Item.description.value
      };
      response = await this.dataService.fetchIngresos('PUT', body);
      if (!SharedService.isProduction) console.log(response);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    }

    if (response.message === 'Registro editado.') {
      this.errorMsg = '';
      this.Edit(false);
    } else
      this.errorMsg = response.message;
  }

  async ExportToExcel() {
    const columns = [
      { header: 'Fecha', key: 'date', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 15 },
      { header: 'ID Inventario', key: 'inventarioId', width: 20 },
      { header: 'Monto', key: 'monto', width: 15 },
      { header: 'Margen de Beneficio', key: 'margenBeneficio', width: 20 },
      { header: 'Método', key: 'method', width: 15 },
      { header: 'Categoría', key: 'category', width: 20 },
      { header: 'Comprobante', key: 'comprobante', width: 20 },
      { header: 'Anulado', key: 'anulado', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Descripción', key: 'description', width: 25 }
    ];

    const dataCopy = this.dataSource.data.map(row => ({
      ...row,
      anulado: row.anulado == '0' ? 'NO' : row.anulado == '1' ? 'SI' : row.anulado,
      inventarioId: row.inventarioId ? row.inventarioId : '-',
    }));

    this.excelExportService.exportToExcel(columns, dataCopy, 'Ingresos');
  }

  public Create(visible: boolean) {
    if (visible)
      this.Remito(false);
    if (visible && this.itemRemito.length === 0) {   // Primer inicio
      if (this.dataEmpresa.ingresoRapidoEnabled == '1')
        Object.keys(this.Item).forEach(key => {
          this.Item[key].patchValue(this.sharedService.rellenoCampos_IE('i')[key] || '');
        });
    }
    this.create = visible;
  }

  public remitoCreate(addMore: boolean) {
    if (this.dataEmpresa.validarInventarioEnabled == '1' && !this.productoValido()) return;
    try {
      const i = this._getProduct(this.Item.inventarioId.value);

      this.Item.inventarioId.setValue((this.dataInventario.find(i => i.nombre == this.Item.nombre.value)?.id === this.Item.inventarioId.value) ? this.Item.inventarioId.value : null);
      this.Item.margenBeneficio.setValue(i ? (i.tipo === 'Producto' ? this.Item.margenBeneficio.value : 0) : 0);
      this.Item.costo.setValue(i.costo ? i.costo : 0);

      const body: Ingreso = {
        id: this.Item.id.value,
        date: this.Item.date.value,
        nombre: this.Item.nombre.value,
        inventarioId: this.Item.inventarioId.value,
        moneda: this.Item.moneda.value,
        monto: this.Item.monto.value,
        costo: this.Item.costo.value,
        margenBeneficio: this.Item.margenBeneficio.value,
        method: this.Item.method.value,
        category: this.Item.category.value,
        comprobante: this.Item.comprobante.value,
        anulado: '0',
        cliente: this.Item.cliente.value,
        description: this.Item.description.value
      };

      this.itemRemito.push(body);

      if (addMore) {
        this.Item.nombre.setValue('');
        this.Item.inventarioId.setValue('');
        this.Item.monto.setValue(0);
        this.Item.costo.setValue(0);
      } else {
        this.Create(false);
        this.Remito(true);
      }
    } catch (error) {
      console.error('Se ha producido un error:', error);
      this.Create(false);
      this.Edit(false);
      this.Remito(false);
    } finally { }
  }

  public async remitoRecord(descargarRemito: boolean) {
    try {
      if (!SharedService.isProduction) console.log(this.itemRemito);

      const response = await this.dataService.fetchIngresos('POST', this.itemRemito);
      if (response && response.comprobante && response.comprobante.length === 10) {
        if (!SharedService.isProduction) console.log('Remito generado: ' + response.comprobante);
        if (descargarRemito)
          this.R.generateAndDownloadPDF(this.R, response.comprobante);
        if (this.dataEmpresa.ingresoRestaStockEnabled == '1' && this.dataEmpresa.validarInventarioEnabled == '1') {
          const inventarioIds = this.itemRemito.map(item => item.inventarioId);
          const coincidencias: Inventario[] = inventarioIds.flatMap(id => this.dataInventario.filter(item => item.id === id));
          this.restarStock(coincidencias);
        }
      } else {
        if (!SharedService.isProduction) console.log('Error al generar el remito.');
      }
    } catch (error) {
      console.error('Se ha producido un error:', error);
      this.Create(false);
      this.Edit(false);
      this.Remito(false);
    } finally {
      this.Remito(false);
    }
  }
}








