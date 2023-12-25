import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, proveedor } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';
import { SharedService } from '@services/shared/shared.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';
import { FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})

export class ProveedoresComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<proveedor>;
  public isLoading = true;
  public create = false;
  public edit = false;
  public detail = false;

  public Item: any = {
    id: new FormControl(0),
    empresaId: new FormControl(0),
    company: new FormControl(''),
    contactFullname: new FormControl('', Validators.required),
    phone: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    website: new FormControl(''),
    accountNumber: new FormControl(''),
    tipoSuministro: new FormControl(''),
    observation: new FormControl('')
  };

  public Columns: { [key: string]: string } = {
    company: 'Empresa',
    contactFullname: 'Nombre contacto',
    phone: 'Teléfono',
    website: 'Sitio web',
    tipoSuministro: 'Suministro',
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0])
        this.dataEmpresa = data[0];
    });
    this.dataService.fetchEmpresa('GET');

    this.dataService.Proveedores$.subscribe({
      next: (data) => {
        if (data && data.length) {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.loading(true);
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
    this.resetItemFormControls();
    this.detail = visible;
  }

  public Edit(visible: boolean) {
    this.resetItemFormControls();
    this.edit = visible;
  }

  public Create(visible: boolean) {
    this.resetItemFormControls();
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

  resetItemFormControls() {
    Object.keys(this.Item).forEach(key => {
      this.Item[key].reset();
    });
  }

  private rellenarRecord(item: any) {
    this.resetItemFormControls();
    Object.keys(this.Item).forEach(key => {
      this.Item[key].patchValue(item[key] || '');
    });
  }

  public record(method: string) {
    try {
      const body: proveedor = {
        id: this.Item.id.value,
        empresaId: this.dataEmpresa.id,
        company: this.Item.company.value,
        contactFullname: this.Item.contactFullname.value,
        phone: this.Item.phone.value,
        email: this.Item.email.value,
        address: this.Item.address.value,
        website: this.Item.website.value,
        accountNumber: this.Item.accountNumber.value,
        tipoSuministro: this.Item.tipoSuministro.value,
        observation: this.Item.observation.value,
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
    this.loading(true);
    this.cacheService.remove('Proveedores');
    this.dataService.fetchProveedores('GET');
  }

  ExportToExcel() {
    const columns = [
      { header: 'Empresa', key: 'company', width: 20 },
      { header: 'Nombre Completo del Contacto', key: 'contactFullname', width: 25 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Dirección', key: 'address', width: 25 },
      { header: 'Sitio Web', key: 'website', width: 20 },
      { header: 'Número de Cuenta', key: 'accountNumber', width: 20 },
      { header: 'Tipo de Suministro', key: 'tipoSuministro', width: 20 },
      { header: 'Observación', key: 'observation', width: 30 }
    ];
    this.excelExportService.exportToExcel(columns, this.dataSource.data, 'Proveedores');
  }
}






