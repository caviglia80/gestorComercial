import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, proveedor } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})

export class ProveedoresComponent implements OnInit, AfterViewInit {
  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<proveedor>;
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public detail = false;

  public Columns: { [key: string]: string } = {
    /* id: 'ID', */
    company: 'Empresa',
    contactFullname: 'Nombre contacto',
    phone: 'Teléfono',
    /* email: 'Correo', */
    /*  address: 'Dirección', */
    website: 'Sitio web',
    /* accountNumber: 'Número de cuenta', */
    tipoSuministro: 'Suministro',
    /* observation: 'Observación', */
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService
  ) { }

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
    this.Item.tipoSuministro = item.tipoSuministro;
    this.Item.observation = item.observation;
  }

  public record(method: string) {
    try {
      const body: proveedor = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        company: this.Item.company,
        contactFullname: this.Item.contactFullname,
        phone: this.Item.phone,
        email: this.Item.email,
        address: this.Item.address,
        website: this.Item.website,
        accountNumber: this.Item.accountNumber,
        tipoSuministro: this.Item.tipoSuministro,
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

  refresh() {
    this.isLoading = true;
    this.cacheService.remove('Proveedores');
    this.dataService.fetchProveedores('GET');
  }
}






