import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { GobalVars } from '@app/app.component';
import { Product } from '@models/product';
import { SharedService } from '@services/shared.service';


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

  /*   public dataSource = new MatTableDataSource<Product>(ELEMENT_DATA); */
  public dataSource = new MatTableDataSource<Product>;
  public isLoading = true;
  public selectQuery: string = 'SELECT * FROM inventario';
  public selectedItem: { key: string; value: any }[] | null = null;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    public sharedService: SharedService
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    /*     this.loadDatabaseData(); */
    this.sendQueryToServer(this.selectQuery, 'get');
    this.sharedService.getDataRow().subscribe((valor: any) => { this.selectedItem = valor; });
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
      this.http.get<Product[]>(requestUrl)
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

  /* hacer global con service */
  public announceSortChange(sortState: Sort) {
    if (sortState.direction)
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`); else
      this._liveAnnouncer.announce('Sorting cleared');
  }

  public viewItem(item: Product) {
    this.selectedItem = Object.entries(item).map(([key, value]) => ({ key, value }));
    this.sharedService.setDataRow(this.selectedItem);
  }

  public editItem(item: Product) {
    // Implement the logic to edit the item
  }

  public duplicateItem(item: Product) {
    const newName = 'Duplicado - ' + item.name;
    const duplicateQuery = `
    INSERT INTO inventario (name, buyPrice, sellPrice, stock, ventasRealizadas, observacion)
    SELECT '${newName}', buyPrice, sellPrice, stock, ventasRealizadas, observacion FROM inventario
    WHERE id = ${item.id};
   `;
    this.sendQueryToServer(duplicateQuery, 'post');
  }

  public deleteItem(item: Product) {
    this.sendQueryToServer(`DELETE FROM inventario WHERE id = ${item.id};`, 'delete');
  }

  public quitarSeleccion() {
    this.selectedItem = null;
  }















}

/* export interface Product {
  id: number;
  name: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  observacion: string;
  ventasRealizadas: number;
} */





/* const ELEMENT_DATA: Product[] = [
  {
    id: 1,
    name: 'Product 1',
    stock: 50,
    buyPrice: 10.50,
    sellPrice: 15.99,
    observacion: 'Observation for Product 1',
    ventasRealizadas: 100
  },
  {
    id: 2,
    name: 'Product 2',
    stock: 30,
    buyPrice: 8.75,
    sellPrice: 12.49,
    observacion: 'Observation for Product 2',
    ventasRealizadas: 75
  },
]; */

