import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { moneyOutlays, proveedor, empresa } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CacheService } from '@services/cache/cache.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})

export class EgresosComponent implements OnInit, AfterViewInit {
  public dataEmpresa: empresa = new empresa();
  public proveedorControl = new FormControl();
  public proveedorFiltered: Observable<any[]>;
  public proveedorData: proveedor[] = [];
  public dataSource = new MatTableDataSource<moneyOutlays>;
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public detail = false;
  /*   private currentEmpresa: any; */

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    beneficiary_provider: 'Beneficiario/Proveedor',
    /*     currency: 'Moneda', */
    category: 'Rubro',
    amount: 'Monto',
    /*     method: 'Método de Gasto', */
    /*     invoice: 'Comprobante', */
    /*     description: 'Descripción', */
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService
  ) {
    this.proveedorFiltered = this.proveedorControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProveedor(value))
    );
  }

  ngOnInit() {
    this.dataInit();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0])
        this.dataEmpresa = data[0];
    });
    this.dataService.fetchEmpresa('GET');

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

    this.dataService.Proveedores$.subscribe((data) => {
      this.proveedorData = data;
    });
    this.getProveedor();
  }

  private _filterProveedor(value: string): any[] {
    this.getProveedor();
    if (value) {
      const filterValue = value?.toString().toLowerCase();
      if (filterValue)
        return this.proveedorData.filter(item =>
          item.company?.toString().toLowerCase().includes(filterValue) ||
          item.contactFullname?.toString().toLowerCase().includes(filterValue)
        );
      else return [];
    } else return [];
  }

  public getProveedor() {
    this.dataService.fetchProveedores('GET');
  }

  private loading(state: boolean) {
    this.isLoading = state;
  }

  public getColumnsKeys() {
    return Object.keys(this.Columns);
  }

  public searchFilter(filterValue: string) {
    filterValue = filterValue?.toString().toLowerCase().trim();
    this.dataSource.filter = filterValue ? filterValue : '';
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
    if (this.dataEmpresa.egresoRapidoEnabled === '1')
      this.Item = this.sharedService.rellenoCampos_IE('e');
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
    this.Item.currency = item.currency;
    this.Item.amount = item.amount;
    this.Item.method = item.method;
    this.Item.category = item.category;
    this.Item.invoice = item.invoice;
    this.Item.beneficiary_provider = item.beneficiary_provider;
    this.Item.description = item.description;
  }

  public record(method: string) {
    try {
      const body: moneyOutlays = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        date: this.Item.date,
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

  refresh() {
    this.isLoading = true;
    this.cacheService.remove('Egresos');
    this.dataService.fetchEgresos('GET');
    this.getProveedor();
  }
}






