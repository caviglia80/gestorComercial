import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Product } from '@models/product';
import { SharedService } from '@services/shared.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
  private selectQuery: string = 'SELECT * FROM inventario';
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
    this.DB('GET');
  }

  private DB(method: string, params: string = '') {
    this.sharedService.request(method, params).subscribe({
      next: (data: Product[]) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: (error) => {
        console.error(JSON.stringify(error, null, 2));
      }
    });

/*     if (method === 'DELETE') {
      this.DB('GET');
    } */
  }


























  /* hacer global con service */
  public sendQueryToServer(query: string, action: string) {

    const apiUrl = GobalVars.host + 'inventario2.php?q=' + encodeURIComponent(query);
    const requestUrl = GobalVars.proxyUrl + apiUrl; /* CORS */

    if (action === 'get') {
      this.http.get<Product[]>(apiUrl)
        .subscribe({
          next: (response) => {
            this.dataSource.data = response || [];
            this.loading(false);
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
            this.loading(false);
          }
        });
    } else if (action === 'delete') {
      this.http.delete(apiUrl)
        .subscribe({
          next: () => {
            // Item deleted successfully, refresh the data
            this.sendQueryToServer(this.selectQuery, 'get');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
            this.sendQueryToServer(this.selectQuery, 'get'); /* por el CORS */
          }
        });
    } else if (action === 'post') {
      this.http.post(apiUrl, {}) // Use an empty object as the request body
        .subscribe({
          next: (response) => {
            console.log(response);
            // Duplicated item successfully, refresh the data
            this.sendQueryToServer(this.selectQuery, 'select');
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
            this.sendQueryToServer(this.selectQuery, 'select'); /* por el CORS */
          }
        });
    }
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
    this.DB('DELETE', `?id=${item.id}`);


    /*     this.sendQueryToServer(`DELETE FROM inventario WHERE id = ${item.id};`, 'delete'); */
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
      this.sendQueryToServer(Query, 'post');
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
      this.sendQueryToServer(Query, 'post');
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
      this.sendQueryToServer(Query, 'post');
      this.sharedService.message('Duplicado: ' + this.Item['name']);
    } catch (error) {
      this.sharedService.message('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Double(false);
    }
  }










}






