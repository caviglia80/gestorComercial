import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { GobalVars } from '@app/app.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements AfterViewInit {
  public displayedColumns: string[] = ['id', 'name', 'buyPrice', 'sellPrice', 'stock', 'ventasRealizadas', 'observacion'];
  /*   public dataSource = new MatTableDataSource<Product>(ELEMENT_DATA); */
  public dataSource = new MatTableDataSource<Product>;
  public isLoading = true;
  @Input() public query: string = '';

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,

  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    /*     this.loadDatabaseData(); */
    this.sendQueryToServer();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();

    if (filterValue === '') {
      this.dataSource.filter = ''; // Restablecer el filtro
    } else {
      this.dataSource.filter = filterValue; // Aplicar el filtro
    }
  }

  /* no borrar, por si cambio a consultas desde backend */
  /*   loadDatabaseData() {
      this.http.get<Product[]>(GobalVars.host + 'get_data_from_db.php')
        .subscribe({
          next: (response) => {
            this.dataSource.data = response || [];
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(JSON.stringify(error, null, 2))
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
    } */

  // Metodo para enviar la consulta al servidor
  sendQueryToServer() {
    this.http.get<Product[]>(GobalVars.host + 'db2.php?q=' + encodeURIComponent(this.query))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response || [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(JSON.stringify(error, null, 2));
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  public announceSortChange(sortState: Sort) {
    if (sortState.direction)
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`); else
      this._liveAnnouncer.announce('Sorting cleared');
  }
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  observacion: string;
  ventasRealizadas: number;
}


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

