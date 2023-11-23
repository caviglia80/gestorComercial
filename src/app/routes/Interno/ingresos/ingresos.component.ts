import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { CacheService } from '@services/cache/cache.service';
import { empresa, moneyIncome, Inventario } from '@models/mainClasses/main-classes';
import { Remito } from '@models/remito/remito';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})

export class IngresosComponent implements OnInit, AfterViewInit {
  public dataEmpresa: empresa = new empresa();
  public inventarioControl = new FormControl();
  public filteredInventario: Observable<any[]>;
  public dataIngreso = new MatTableDataSource<moneyIncome>;
  public dataInventario: Inventario[] = [];
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public detail = false;
  public remito = false;
  public fullNameProducto = '';
  public itemRemito: moneyIncome[] = [];
  public R: Remito = new Remito();

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    anulado: 'Anulado',
    idInventario: 'Inventario',
    cliente: 'Cliente',
    /*     currency: 'Moneda', */
    amount: 'Monto',
    /*     method: 'Método de Pago', */
    category: 'Rubro',
    /*     invoice: 'Comprobante', */
    /*     margenBeneficio: 'PVP', */
    /*     description: 'Descripción', */
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService
  ) {
    this.filteredInventario = this.inventarioControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value))
    );
  }

  ngOnInit() {
    this.dataInit();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataIngreso.paginator = this.paginator;
    this.dataIngreso.sort = this.sort;
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0])
        this.dataEmpresa = data[0];
    });
    this.dataService.fetchEmpresa('GET');

    this.dataService.Ingresos$.subscribe({
      next: (data) => {
        this.dataIngreso.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchIngresos('GET');

    this.dataService.Inventario$.subscribe((data) => {
      this.dataInventario = data;
    });
    this.getInventario();

    this.dataService.PDF$.subscribe((data) => {
      //  this.PDF = data;
    });
  }

  public onProductoSeleccionado(event: any): void {
    const inventario: Inventario = this._getProduct(event.option.value);
    if (inventario)
      if (inventario.tipo === 'Producto') {
        if (this.dataEmpresa.permitirStockCeroEnabled === '1') {
          this.Item.amount = this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio);
        } else {
          if (inventario.existencias != 0) {
            this.Item.amount = this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio);
          } else {
            this.sharedService.message('Advertencia: el producto no tiene stock');
            this.Item.amount = 0;
            this.inventarioControl.reset();
          }
        }
        this.Item.margenBeneficio = inventario.margenBeneficio;
      } else {
        this.Item.amount = this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio);
      }
  }

  private _filterProduct(value: string): any[] {
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

  public _getProduct(idInventario: any): Inventario {
    this.getInventario();
    if (idInventario)
      return this.dataInventario.filter(item =>
        item.id?.toString().toLowerCase() === idInventario?.toString().toLowerCase()
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
    this.dataIngreso.filter = filterValue ? filterValue : '';
  }

  public Detail(visible: boolean) {
    this.Item = {};
    this.detail = visible;
  }

  public Edit(visible: boolean) {
    this.Item = {};
    this.edit = visible;
  }

  public Remito(visible: boolean) {
    if (!visible) {
      this.R = new Remito()
      this.Item = {};
      this.itemRemito = [];
    } else {
      this.R = this.R.getRemito(this.itemRemito, this.dataInventario);
    }
    this.remito = visible;
  }

  public Create(visible: boolean) {
    if (visible) {
      this.Item.idInventario = '';
      this.Item.amount = 0;
    }

    // Primer inicio
    if (visible && this.itemRemito.length === 0) {
      this.Item = {};
      if (this.dataEmpresa.ingresoRapidoEnabled === '1')
        this.Item = this.sharedService.rellenoCampos_IE('i');
    }
    this.create = visible;
  }

  public viewItem(item: moneyIncome) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: moneyIncome) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: moneyIncome) {
    this.dataService.fetchIngresos('DELETE', { id: item.id });
  }

  public anularItem(item: moneyIncome) {
    item.anulado = '1';
    this.dataService.fetchIngresos('PUT', item);
    /*     if (this.dataEmpresa.ingresoAnuladoSumaStockEnabled === '1' && this.dataEmpresa.validarInventarioEnabled === '1')
          this.sumarStock(this._getProduct(item.idInventario)); */
  }

  private rellenarRecord(item: moneyIncome) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.date = item.date;
    this.Item.idInventario = item.idInventario;
    this.fullNameProducto = item.idInventario ? item.idInventario : '';
    const inv: Inventario = this._getProduct(item.idInventario);
    if (inv)
      this.fullNameProducto = (inv.id + ' - ') + (inv.idExterno ? inv.idExterno + ' - ' : ' - ') + (inv.nombre);
    else
      this.fullNameProducto = item.idInventario + ' (No encontrado en inventario)';
    this.Item.currency = item.currency;
    this.Item.amount = item.amount;
    this.Item.margenBeneficio = item.margenBeneficio;
    this.Item.method = item.method;
    this.Item.category = item.category;
    this.Item.invoice = item.invoice;
    this.Item.anulado = item.anulado;
    this.Item.cliente = item.cliente;
    this.Item.description = item.description;
    this.Item.tipo = inv ? inv.tipo : '';
  }

  private restarStock(inventario: Inventario) {
    if (inventario) {
      if (inventario.tipo === 'Producto') {
        let existenciasCount: number = inventario.existencias ? inventario.existencias : 0;
        if (existenciasCount > 0) {
          existenciasCount--;
          this.dataService.fetchInventario('PUT', { id: inventario.id, existencias: existenciasCount });
          this.sharedService.message('Se descontó una unidad del stock.');
        } else
          this.sharedService.message('Advertencia: no hay stock para descontar.');
      }
    } else {
      this.sharedService.message('Advertencia: no se localizó el ID del producto.');
    }
  }

  private productoValido(): boolean {
    if (!this._getProduct(this.Item.idInventario)) {
      this.sharedService.message('Advertencia: seleccione un producto válido.');
      this.Item.amount = 0;
      this.inventarioControl.reset();
      return false;
    }
    return true;
  }

  private sumarStock(inventario: Inventario) {
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

  public getName(inventario: Inventario): string {
    if (inventario.idExterno)
      return inventario.id?.toString() + ' - ' + inventario.idExterno?.toString() + ' - ' + inventario.nombre;
    else
      return inventario.id?.toString() + ' - ' + inventario.nombre;
  }

  public refresh() {
    this.isLoading = true;
    this.cacheService.remove('Ingresos');
    this.dataService.fetchIngresos('GET');
    this.getInventario();
  }

  public remitoCreate(moreItems: boolean) {
    if (this.dataEmpresa.validarInventarioEnabled === '1' && !this.productoValido()) return;
    try {
      const body: moneyIncome = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        date: this.Item.date,
        idInventario: this.Item.idInventario,
        currency: this.Item.currency,
        amount: this.Item.amount,
        margenBeneficio: this._getProduct(this.Item.idInventario) ? (this._getProduct(this.Item.idInventario).tipo === 'Producto' ? this.Item.margenBeneficio : 0) : 0,
        method: this.Item.method,
        category: this.Item.category,
        invoice: this.Item.invoice,
        anulado: '0',
        cliente: this.Item.cliente,
        description: this.Item.description
      };

      this.itemRemito.push(body);

      if (!moreItems) {
        this.Create(false);
        this.Remito(true);
      } else {
        this.Create(true);
      }
    } catch (error) {
      console.error('Se ha producido un error:', error);
      this.Create(false);
      this.Edit(false);
      this.Remito(false);
    } finally { }
  }

  public remitoRecord(descargarRemito: boolean) {
    try {

      if (!SharedService.isProduction) console.log(this.itemRemito);
      this.dataService.fetchIngresos('POST', this.itemRemito);
      if (descargarRemito)
        this.R.generateAndDownloadPDF(this.R);
    } catch (error) {
      console.error('Se ha producido un error:', error);
      this.Create(false);
      this.Edit(false);
      this.Remito(false);

      // pagina de error o mensaje

    } finally {
      this.Remito(false);
    }
  }

  public recordEdit() {
    if (this.dataEmpresa.validarInventarioEnabled === '1' && !this.productoValido()) return;
    try {
      const body: moneyIncome = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        date: this.Item.date,
        idInventario: this.Item.idInventario,
        currency: this.Item.currency,
        amount: this.Item.amount,
        margenBeneficio: this.Item.margenBeneficio,
        method: this.Item.method,
        category: this.Item.category,
        invoice: this.Item.invoice,
        anulado: this.Item.anulado,
        cliente: this.Item.cliente,
        description: this.Item.description
      };
      this.dataService.fetchIngresos('PUT', body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Edit(false);
    }
  }








}








