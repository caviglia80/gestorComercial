import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Product } from '@models/product';
/* import { SharedService } from '@services/shared.service'; */
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-t-inventario',
  templateUrl: './t-inventario.component.html',
  styleUrls: ['./t-inventario.component.css']
})

export class TInventarioComponent implements AfterViewInit {
  public displayedColumns: string[] = [
    'id',
    'name',
    'buyPrice',
    'sellPrice',
    'stock',
    'ventasRealizadas',
    'observacion',
    'actions'
  ];

  public propertyAliases: { [key: string]: string } = {
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
  public selectQuery: string = 'SELECT * FROM inventario';
  public newRecord: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public double: boolean = false;
  public detail: boolean = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
/*     public sharedService: SharedService, */
    private notificationService: NotificationService
  ) {  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    /*     this.loadDatabaseData(); */
    this.sendQueryToServer(this.selectQuery, 'get');
    /* this.sharedService.getDataRow().subscribe((valor: any) => { this.selectedItem = valor; }); */
  }

  /* hacerlo componente compartido */
  copyToClipboard(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();

    try {
      document.execCommand('copy');
      this.notificationService.show('Texto copiado !');
    } finally {
      document.body.removeChild(el);
    }
  }

  /* hacer global con service */
  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    if (filterValue === '') this.dataSource.filter = ''; else
      this.dataSource.filter = filterValue;
  }

  /* no borrar, por si cambio a consultas desde backend */
  /*   loadDatabaseData() {
      this.http.get<Product[]>(GobalVars.host + 'get_data_from_db.php')
        .subscribe({
          next: (response) => {
            this.dataSource.data = response || [];
this.loading();
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2))
this.loading();
          }
        });
    } */

  /* hacer global con service */
  public sendQueryToServer(query: string, action: string) {

    const apiUrl = GobalVars.host + 'db2.php?q=' + encodeURIComponent(query);
    const requestUrl = GobalVars.proxyUrl + apiUrl; /* CORS */

    if (action === 'get') {
      this.http.get<Product[]>(apiUrl)
        .subscribe({
          next: (response) => {
            this.dataSource.data = response || [];
            this.loading();
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2));
            this.loading();
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

  private loading() {
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  /* hacer global con pipe? */
  public announceSortChange(sortState: Sort) {
    if (sortState.direction)
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`); else
      this._liveAnnouncer.announce('Sorting cleared');
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
    this.sendQueryToServer(`DELETE FROM inventario WHERE id = ${item.id};`, 'delete');
  }

  public Detail(visible: boolean) {
    this.newRecord = {};
    this.detail = visible;
  }

  public Create(visible: boolean) {
    this.newRecord = {};
    this.create = visible;
  }

  public rellenarRecord(item: Product) {
    this.newRecord = {};
    this.newRecord['id'] = item.id;
    this.newRecord['name'] = item.name;
    this.newRecord['buyPrice'] = item.buyPrice;
    this.newRecord['sellPrice'] = item.sellPrice;
    this.newRecord['stock'] = item.stock;
    this.newRecord['ventasRealizadas'] = item.ventasRealizadas;
    this.newRecord['observacion'] = item.observacion;
  }

  public createRecord() {
    try {
      const Query = `
      INSERT INTO inventario (name, buyPrice, sellPrice, stock, ventasRealizadas, observacion)
      VALUES ('${this.newRecord['name']}',
       '${this.newRecord['buyPrice']}',
        '${this.newRecord['sellPrice']}',
         '${this.newRecord['stock']}',
          '${this.newRecord['ventasRealizadas']}',
           '${this.newRecord['observacion']}');
     `;
      this.sendQueryToServer(Query, 'post');
      this.notificationService.show('Creado: ' + this.newRecord['name']);
    } catch (error) {
      this.notificationService.show('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
    }
  }

  public Edit(visible: boolean) {
    this.newRecord = {};
    this.edit = visible;
  }

  public editRecord() {
    try {
      const Query = `
      UPDATE inventario
      SET
      name='${this.newRecord['name']}',
      buyPrice='${this.newRecord['buyPrice']}',
      sellPrice='${this.newRecord['sellPrice']}',
      stock='${this.newRecord['stock']}',
      ventasRealizadas='${this.newRecord['ventasRealizadas']}',
      observacion='${this.newRecord['observacion']}'
      WHERE id='${this.newRecord['id']}';
     `;
      this.sendQueryToServer(Query, 'post');
      this.notificationService.show('Editado: ' + this.newRecord['name']);
    } catch (error) {
      this.notificationService.show('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Edit(false);
    }
  }

  public Double(visible: boolean) {
    this.newRecord = {};
    this.double = visible;
  }

  public doubleRecord() {
    try {
      const Query = `
      INSERT INTO inventario (name, buyPrice, sellPrice, stock, ventasRealizadas, observacion)
      VALUES ('${this.newRecord['name']}',
       '${this.newRecord['buyPrice']}',
        '${this.newRecord['sellPrice']}',
         '${this.newRecord['stock']}',
          '${this.newRecord['ventasRealizadas']}',
           '${this.newRecord['observacion']}');
     `;
      this.sendQueryToServer(Query, 'post');
      this.notificationService.show('Duplicado: ' + this.newRecord['name']);
    } catch (error) {
      this.notificationService.show('Se ha producido un error.');
      console.error('Se ha producido un error:', error);
    } finally {
      this.Double(false);
    }
  }










}






