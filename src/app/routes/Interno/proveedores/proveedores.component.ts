import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { proveedor } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})

export class ProveedoresComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<proveedor>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    /* id: 'ID', */
    company: 'Empresa',
    contactFullname: 'Nombre contacto',
    phone: 'Teléfono',
    /* email: 'Correo', */
    /*  address: 'Dirección', */
    website: 'Sitio web',
    /* accountNumber: 'Número de cuenta', */
    supply: 'Suministro',
    /* observation: 'Observación', */
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
    this.dataService.Proveedores$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchProveedores('GET');
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
    this.create = visible;
  }

  public viewItem(item: proveedor) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: proveedor) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: proveedor) {
    this.dataService.fetchProveedores('DELETE', { id: item.id, company: item.company });
  }

  private rellenarRecord(item: proveedor) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.company = item.company;
    this.Item.contactFullname = item.contactFullname;
    this.Item.phone = item.phone;
    this.Item.email = item.email;
    this.Item.address = item.address;
    this.Item.website = item.website;
    this.Item.accountNumber = item.accountNumber;
    this.Item.supply = item.supply;
    this.Item.observation = item.observation;
  }

  public record(method: string) {
    try {
      const body: proveedor = {
        id: this.Item.id,
        company: this.Item.company,
        contactFullname: this.Item.contactFullname,
        phone: this.Item.phone,
        email: this.Item.email,
        address: this.Item.address,
        website: this.Item.website,
        accountNumber: this.Item.accountNumber,
        supply: this.Item.supply,
        observation: this.Item.observation
      };
      this.dataService.fetchProveedores(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
    }
  }
}






