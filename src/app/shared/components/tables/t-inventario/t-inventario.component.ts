import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
/* import { GobalVars } from '@app/app.component'; */
import { Product } from '@models/product';
import { SharedService } from '@services/shared.service';
/* import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; */

@Component({
  selector: 'app-t-inventario',
  templateUrl: './t-inventario.component.html',
  styleUrls: ['./t-inventario.component.css']
})

export class TInventarioComponent implements AfterViewInit {

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

  public dataSource = new MatTableDataSource<Product>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public double: boolean = false;
  public detail: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    public sharedService: SharedService,
  ) { }

  private loading(state: boolean) {
    this.isLoading = state;
    this.cdr.detectChanges();
  }

  public searchFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    if (filterValue === '') this.dataSource.filter = ''; else
      this.dataSource.filter = filterValue;
  }

  public getColumnsKeys() {
    return Object.keys(this.Columns);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sharedService.data$.subscribe(data => {
      this.dataSource.data = data;
      this.loading(false);
    });
    this.sharedService.fetchData('SELECT * FROM inventario', 'GET');
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
    this.sharedService.fetchData(`DELETE FROM inventario WHERE id =${item.id}`, 'DELETE');
  }

  private rellenarRecord(item: Product) {
    this.Item = {};
    this.Item['id'] = item.id;
    this.Item['name'] = item.name;
    this.Item['buyPrice'] = item.buyPrice;
    this.Item['sellPrice'] = item.sellPrice;
    this.Item['stock'] = item.stock;
    this.Item['ventasRealizadas'] = item.ventasRealizadas;
    this.Item['observacion'] = item.observacion;
  }

  public createRecord() {
    try {
      const Query = `
      INSERT INTO inventario (name, buyPrice, sellPrice, stock, ventasRealizadas, observacion)
      VALUES ('${this.Item['name']}',
       '${this.Item['buyPrice']}',
        '${this.Item['sellPrice']}',
         '${this.Item['stock']}',
          '${this.Item['ventasRealizadas']}',
           '${this.Item['observacion']}');
     `;
      this.sharedService.fetchData(Query, 'POST');
      this.sharedService.message('Creado: ' + this.Item['name']);
    } catch (error) {
      this.sharedService.message('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
    }
  }

  public editRecord() {
    try {
      const Query = `
      UPDATE inventario
      SET
      name='${this.Item['name']}',
      buyPrice='${this.Item['buyPrice']}',
      sellPrice='${this.Item['sellPrice']}',
      stock='${this.Item['stock']}',
      ventasRealizadas='${this.Item['ventasRealizadas']}',
      observacion='${this.Item['observacion']}'
      WHERE id='${this.Item['id']}';
     `;
      this.sharedService.fetchData(Query, 'PUT');
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
      const Query = `
      INSERT INTO inventario (name, buyPrice, sellPrice, stock, ventasRealizadas, observacion)
      VALUES ('${this.Item['name']}',
       '${this.Item['buyPrice']}',
        '${this.Item['sellPrice']}',
         '${this.Item['stock']}',
          '${this.Item['ventasRealizadas']}',
           '${this.Item['observacion']}');
     `;
      this.sharedService.fetchData(Query, 'POST');
      this.sharedService.message('Duplicado: ' + this.Item['name']);
    } catch (error) {
      this.sharedService.message('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Double(false);
    }
  }










}






