import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { moneyOutlays } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Product } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})

export class EgresosComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<moneyOutlays>;
  public dataInventario: Product[] = [];
  public inventarioControl = new FormControl();
  public filteredInventario: Observable<any[]>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public detail: boolean = false;
  /*   private currentConfiguracion: any; */

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    product: 'Producto',
    currency: 'Moneda',
    amount: 'Monto',
    /*     method: 'Método de Gasto', */
    category: 'Rubro',
    /*     invoice: 'Comprobante', */
    beneficiary_provider: 'Beneficiario/Proveedor',
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
    this.dataService.Egresos$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchEgresos('GET');
  }

  public onProductoSeleccionado(event: any): void {
    const selectedProduct = this._getProduct(event.option.value);
    this.Item.amount = this.dataService.getPvp(this._getProduct(selectedProduct.id).costPrice);
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
    if (this.dataService.getCurrentConfiguracion().egresoRapidoEnabled === '1')
      this.Item = this.sharedService.crearDefault();
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
    this.Item.product = item.product;
    this.Item.currency = item.currency;
    this.Item.amount = item.amount;
    this.Item.method = item.method;
    this.Item.category = item.category;
    this.Item.invoice = item.invoice;
    this.Item.beneficiary_provider = item.beneficiary_provider;
    this.Item.description = item.description;
  }

  public record(method: string) {
    if (!this.productoValido()) return;
    try {
      const body: moneyOutlays = {
        id: this.Item.id,
        date: this.Item.date,
        product: this.Item.product,
        currency: this.Item.currency,
        amount: this.Item.amount,
        method: this.Item.method,
        category: this.Item.category,
        invoice: this.Item.invoice,
        beneficiary_provider: this.Item.beneficiary_provider,
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

  private productoValido(): boolean {
    if (this._getProduct(this.Item.product) === undefined) {
      this.sharedService.message('Advertencia: seleccione un producto válido.');
      this.Item.amount = 0;
      this.inventarioControl.reset();
      return false;
    }
    return true;
  }
}






