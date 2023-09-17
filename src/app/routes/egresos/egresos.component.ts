import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { moneyOutlays } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css']
})

export class EgresosComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<moneyOutlays>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    date: 'Fecha',
    currency: 'Moneda',
    amount: 'Monto',
    /*     expenseMethod: 'Método de Gasto', */
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
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataInit();
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

  public Create(visible: boolean) {
    this.Item = {};
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
    this.Item.expenseMethod = item.expenseMethod;
    this.Item.category = item.category;
    this.Item.invoice = item.invoice;
    this.Item.beneficiary_provider = item.beneficiary_provider;
    this.Item.description = item.description;
  }

  public createRecord() {
    try {
      const body: moneyOutlays = {
        id: this.Item.id,
        date: this.Item.date !== undefined ? this.Item.date : " ",
        currency: this.Item.currency !== undefined ? this.Item.currency : " ",
        amount: this.Item.amount !== undefined ? this.Item.amount : 0,
        expenseMethod: this.Item.expenseMethod !== undefined ? this.Item.expenseMethod : " ",
        category: this.Item.category !== undefined ? this.Item.category : " ",
        invoice: this.Item.invoice !== undefined ? this.Item.invoice : " ",
        beneficiary_provider: this.Item.beneficiary_provider !== undefined ? this.Item.beneficiary_provider : " ",
        description: this.Item.description !== undefined ? this.Item.description : " "
      };
      this.dataService.fetchEgresos('POST', body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
    }
  }

  public editRecord() {
    try {
      const body: moneyOutlays = {
        id: this.Item.id,
        date: this.Item.date !== undefined ? this.Item.date : " ",
        currency: this.Item.currency !== undefined ? this.Item.currency : " ",
        amount: this.Item.amount !== undefined ? this.Item.amount : 0,
        expenseMethod: this.Item.expenseMethod !== undefined ? this.Item.expenseMethod : " ",
        category: this.Item.category !== undefined ? this.Item.category : " ",
        invoice: this.Item.invoice !== undefined ? this.Item.invoice : " ",
        beneficiary_provider: this.Item.beneficiary_provider !== undefined ? this.Item.beneficiary_provider : " ",
        description: this.Item.description !== undefined ? this.Item.description : " "
      };
      this.dataService.fetchEgresos('PUT', body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Edit(false);
    }
  }

}






