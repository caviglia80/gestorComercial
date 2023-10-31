import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { configuracion, moneyIncome } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Inventario } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})

export class IngresosComponent implements AfterViewInit {
  public inventarioControl = new FormControl();
  public filteredInventario: Observable<any[]>;
  public dataSource = new MatTableDataSource<moneyIncome>;
  public dataInventario: Inventario[] = [];
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public detail: boolean = false;
  public fullNameProducto: string = '';

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
    /*     pvpPorcentaje: 'PVP', */
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
    const inventario: Inventario = this._getProduct(event.option.value);
    if (inventario.tipo === 'Producto') {
      if (this.dataService.getCurrentConfiguracion().permitirStockCeroEnabled === '1') {
        this.Item.amount = this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio)
      } else {
        if (inventario.existencias != 0) {
          this.Item.amount = this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio)
        } else {
          this.sharedService.message('Advertencia: el producto no tiene stock');
          this.Item.amount = 0;
          this.inventarioControl.reset();
        }
      }
    } else {
      this.Item.amount = this.sharedService.getPrecioLista(inventario.costo, inventario.margenBeneficio)
    }
  }

  private _filterProduct(value: string): any[] {
    if (this.dataInventario.length === 0)
      this.getInventario();
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.dataInventario.filter(item =>
        item.nombre?.toLowerCase().includes(filterValue) ||
        item.id.toString().toLowerCase().includes(filterValue) ||
        item.idExterno?.toLowerCase().includes(filterValue)
      );
    } else return [];
  }

  public _getProduct(idInventario: any): Inventario {
    if (this.dataInventario.length === 0)
      this.getInventario();
    if (idInventario !== null && idInventario !== undefined) {
      return this.dataInventario.filter(item =>
        item.id.toString().toLowerCase() === idInventario.toLowerCase()
      )[0];
    } else return null!;
  }

  private dataInit_Inventario() {
    this.dataService.Inventario$.subscribe((data) => {
      this.dataInventario = data;
    });
    this.getInventario();
  }

  public getInventario() {
    this.dataService.fetchInventario('GET');
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
      this.Item = this.sharedService.rellenoCampos_IE('i');
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
      this.sumarStock(this._getProduct(item.idInventario));
  }

  private rellenarRecord(item: moneyIncome) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.date = item.date;
    this.Item.idInventario = item.idInventario;
    this.fullNameProducto = item.idInventario != null ? item.idInventario : '';
    const prod: Inventario = this._getProduct(item.idInventario);
    if (prod)
      this.fullNameProducto = (prod.id + ' - ') + (prod.idExterno !== '' ? prod.idExterno + ' - ' : ' - ') + (prod.nombre);
    this.Item.currency = item.currency;
    this.Item.amount = item.amount;
    this.Item.method = item.method;
    this.Item.category = item.category;
    this.Item.invoice = item.invoice;
    this.Item.anulado = item.anulado;
    this.Item.cliente = item.cliente;
    this.Item.description = item.description;
  }

  public record(method: string) {
    if (!this.productoValido()) return;
    try {
      const config: configuracion = this.dataService.getCurrentConfiguracion();
      const body: moneyIncome = {
        id: this.Item.id,
        date: this.Item.date,
        idInventario: this.Item.idInventario,
        currency: this.Item.currency,
        amount: this.Item.amount,
        method: this.Item.method,
        category: this.Item.category,
        invoice: this.Item.invoice,
        anulado: method === 'PUT' ? this.Item.anulado : '0',
        cliente: this.Item.cliente,
        description: this.Item.description
      };
      this.dataService.fetchIngresos(method, body);
      if (config.ingresoRestaStockEnabled === '1' && method === 'POST')
        this.restarStock(this._getProduct(this.Item.idInventario));
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
    }
  }

  private restarStock(inventario: Inventario) {
    if (inventario !== undefined) {
      if (inventario.tipo === 'Producto') {
        let existenciasCount: number = inventario.existencias == null ? 0 : inventario.existencias;
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
    if (this._getProduct(this.Item.idInventario) === undefined) {
      this.sharedService.message('Advertencia: seleccione un producto válido.');
      this.Item.amount = 0;
      this.inventarioControl.reset();
      return false;
    }
    return true;
  }

  private sumarStock(inventario: Inventario) {
    if (inventario !== undefined) {
      if (inventario.tipo === 'Producto') {
        let existenciasCount: number = inventario.existencias == null ? 0 : inventario.existencias;
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
      return inventario.id.toString() + ' - ' + inventario.idExterno.toString() + ' - ' + inventario.nombre;
    else
      return inventario.id.toString() + ' - ' + inventario.nombre;
  }
}








