import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Product } from '@models/product';
import { SharedService } from '@services/shared.service';
import { DataService } from '@services/data.service';

@Component({
  selector: 'app-t-inventario',
  templateUrl: './t-inventario.component.html',
  styleUrls: ['./t-inventario.component.css']
})

export class TInventarioComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<Product>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public double: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    id: 'ID',
    name: 'Nombre',
    buyPrice: 'Precio compra',
    sellPrice: 'Precio venta',
    stock: 'Stock',
    ventasRealizadas: 'Ventas realizadas',
    observacion: 'Observación',
    actions: 'Operaciones'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public sharedService: SharedService,
    public dataService: DataService
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataService.data$.subscribe(data => {
      this.dataSource.data = data;
      this.loading(false);
    });
    this.dataService.fetchInventario_safe('GET');
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
    if (filterValue === '') this.dataSource.filter = ''; else
      this.dataSource.filter = filterValue;
  }

  public Detail(visible: boolean) {
    this.Item = {};
    this.detail = visible;
  }

  public Edit(visible: boolean) {
    this.Item = {};
    this.edit = visible;
  }

  public Double(visible: boolean) {
    this.Item = {};
    this.double = visible;
  }

  public Create(visible: boolean) {
    this.Item = {};
    this.create = visible;
  }

  public viewItem(item: Product) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Product) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public duplicateItem(item: Product) {
    this.Double(true);
    const originalName: string = item.name;
    item.name = 'Duplicado - ' + item.name;
    this.rellenarRecord(item);
    item.name = originalName;
  }

  public deleteItem(item: Product) {
    this.dataService.fetchInventario_safe('DELETE', { id: item.id });
  }

  private rellenarRecord(item: Product) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.name = item.name;
    this.Item.buyPrice = item.buyPrice;
    this.Item.sellPrice = item.sellPrice;
    this.Item.stock = item.stock;
    this.Item.ventasRealizadas = item.ventasRealizadas;
    this.Item.observacion = item.observacion;
  }

  public createRecord() {
    try {
      const body: any = {
        name: this.Item.name,
        buyPrice: this.Item.buyPrice !== undefined ? this.Item.buyPrice : 0,
        sellPrice: this.Item.sellPrice !== undefined ? this.Item.sellPrice : 0,
        stock: this.Item.stock !== undefined ? this.Item.stock : 0,
        ventasRealizadas: this.Item.ventasRealizadas !== undefined ? this.Item.ventasRealizadas : 0,
        observacion: this.Item.observacion !== undefined ? this.Item.observacion : ""
      };
      this.dataService.fetchInventario_safe('POST', body);
      this.sharedService.message('Creado: ' + this.Item.name);
    } catch (error) {
      this.sharedService.message('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
    }
  }

  public editRecord() {
    try {
      const body: any = {
        id: this.Item.id,
        name: this.Item.name,
        buyPrice: this.Item.buyPrice !== undefined ? this.Item.buyPrice : 0,
        sellPrice: this.Item.sellPrice !== undefined ? this.Item.sellPrice : 0,
        stock: this.Item.stock !== undefined ? this.Item.stock : 0,
        ventasRealizadas: this.Item.ventasRealizadas !== undefined ? this.Item.ventasRealizadas : 0,
        observacion: this.Item.observacion !== undefined ? this.Item.observacion : ""
      };
      this.dataService.fetchInventario_safe('PUT', body);
      this.sharedService.message('Editado: ' + this.Item['name']);
    } catch (error) {
      this.sharedService.message('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Edit(false);
    }
  }

  public doubleRecord() {
    try {
      const body: any = {
        name: this.Item.name,
        buyPrice: this.Item.buyPrice !== undefined ? this.Item.buyPrice : 0,
        sellPrice: this.Item.sellPrice !== undefined ? this.Item.sellPrice : 0,
        stock: this.Item.stock !== undefined ? this.Item.stock : 0,
        ventasRealizadas: this.Item.ventasRealizadas !== undefined ? this.Item.ventasRealizadas : 0,
        observacion: this.Item.observacion !== undefined ? this.Item.observacion : ""
      };
      this.dataService.fetchInventario_safe('POST', body);
      this.sharedService.message('Duplicado: ' + this.Item['name']);
    } catch (error) {
      this.sharedService.message('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Double(false);
    }
  }
}






