import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { configuracion, moneyIncome } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { startWith, map, take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})

export class IngresosComponent implements AfterViewInit {
  public inventarioControl = new FormControl();
  public filteredInventario: Observable<any[]>;
  public dataSource = new MatTableDataSource<moneyIncome>;
  public dataInventario: Product[] = [];
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    anulado: 'Anulado',
    product: 'Producto',
    cliente: 'Cliente',
    /*     currency: 'Moneda', */
    amount: 'Monto',
    /*     method: 'Método de Pago', */
    category: 'Rubro',
    /*     invoice: 'Comprobante', */
    pvpPorcentaje: 'PVP',
    /*     description: 'Descripción', */
    actions: 'Operaciones'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    public sharedService: SharedService
  ) {
    this.filteredInventario = this.inventarioControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value))
    );
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataInit();
    this.dataInit_Inventario();
  }

  private dataInit() {
    this.dataService.Ingresos$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchIngresos('GET');
  }

  public onProductoSeleccionado(event: any): void {
    const selectedProduct = this._getProduct(event.option.value);
    if (selectedProduct.stock != 0) {
      this.Item.amount = this.dataService.getPvp(this._getProduct(selectedProduct.id).costPrice);
    } else {
      this.sharedService.message('Advertencia: el producto no tiene stock');
      this.Item.amount = 0;
      this.inventarioControl.reset();
    }
  }

  private _filterProduct(value: string): any[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.dataInventario.filter(item =>
        item.name.toLowerCase().includes(filterValue) ||
        item.id.toString().toLowerCase().includes(filterValue)
      );
    } else return [];
  }

  private _getProduct(id: any): any {
    if (id !== null && id !== undefined) {
      return this.dataInventario.filter(item =>
        item.id.toString().toLowerCase() === id.toLowerCase()
      )[0];
    } else return null;
  }

  public getInventario() {
    this.dataService.fetchInventario('GET');
  }

  private dataInit_Inventario() {
    this.dataService.Inventario$.subscribe((data) => {
      this.dataInventario = data;
    });
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
    if (this.dataService.getCurrentConfiguracion().ingresoRapidoEnabled === '1')
      this.Item = this.sharedService.crearDefault();
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
    if (this.dataService.getCurrentConfiguracion().ingresoAnuladoSumaStockEnabled === '1')
      this.sumarStock(this._getProduct(item.product));
  }

  private rellenarRecord(item: moneyIncome) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.date = item.date;
    this.Item.product = item.product;
    this.Item.currency = item.currency;
    this.Item.amount = item.amount;
    this.Item.method = item.method;
    this.Item.category = item.category;
    this.Item.invoice = item.invoice;
    this.Item.anulado = item.anulado;
    this.Item.cliente = item.cliente;
    this.Item.pvpPorcentaje = item.pvpPorcentaje;
    this.Item.description = item.description;
  }

  public record(method: string) {
    if (!this.productoValido()) return;
    try {
      const config: configuracion = this.dataService.getCurrentConfiguracion();
      const body: moneyIncome = {
        id: this.Item.id,
        date: this.Item.date,
        product: this.Item.product,
        currency: this.Item.currency,
        amount: this.Item.amount,
        method: this.Item.method,
        category: this.Item.category,
        invoice: this.Item.invoice,
        anulado: method === 'PUT' ? this.Item.anulado : '0',
        cliente: this.Item.cliente,
        pvpPorcentaje: method === 'POST' ? config.pvpPorcentaje : this.Item.pvpPorcentaje,
        description: this.Item.description
      };
      this.dataService.fetchIngresos(method, body);
      if (config.ingresoRestaStockEnabled === '1' && method === 'POST')
        this.restarStock(this._getProduct(body.product));
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
    }
  }

  private restarStock(product: Product) {
    if (product !== undefined) {
      let stockCount: number = product.stock;
      if (stockCount > 0) {
        stockCount--;
        this.dataService.fetchInventario('PUT', { id: product.id, stock: stockCount });
        this.sharedService.message('Se descontó una unidad del stock.');
      } else
        this.sharedService.message('Advertencia: no hay stock para descontar.');
    } else {
      this.sharedService.message('Advertencia: no se localizó el ID del producto.');
    }
  }

  private productoValido(): boolean {
    if (this._getProduct(this.Item.product) === undefined) {
      this.sharedService.message('Advertencia: seleccione un producto válido.');
      this.Item.amount = 0;
      this.inventarioControl.reset();
      return false;
    }
    return true;
  }

  private sumarStock(product: Product) {
    if (product !== undefined) {
      let stockCount: number = product.stock;
      stockCount++;
      this.dataService.fetchInventario('PUT', { id: product.id, stock: stockCount });
      this.sharedService.message('Se sumó una unidad al stock.');
    } else {
      this.sharedService.message('Advertencia: no se localizó el ID del producto.');
    }
  }
}








