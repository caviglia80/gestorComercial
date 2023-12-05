import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, User } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit, AfterViewInit {
  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<User>;
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public detail = false;

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    username: 'Usuario',
    fullname: 'Nombre completo',
    position: 'Cargo',
    phone: 'Teléfono',
    email: 'Correo',
    /*     password: 'Contraseña', */
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

    this.dataService.Usuarios$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchUsuarios('GET');
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

  public viewItem(item: User) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: User) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: User) {
    this.dataService.fetchUsuarios('DELETE', { id: item.id });
  }

  private rellenarRecord(item: User) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.username = item.username;
    this.Item.fullname = item.fullname;
    this.Item.position = item.position;
    this.Item.phone = item.phone;
    this.Item.email = item.email;
    this.Item.password = '';
  }

  public record(method: string) {
    try {
      const body: User = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        username: this.Item.username,
        fullname: this.Item.fullname,
        position: this.Item.position,
        phone: this.Item.phone,
        email: this.Item.email,
        password: this.Item.password
      };
      this.dataService.fetchUsuarios(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
    }
  }

  refresh() {
    this.isLoading = true;
    this.cacheService.remove('Usuarios');
    this.dataService.fetchUsuarios('GET');
  }

  ExportToExcel() {
    const columns = [
      { header: 'Usuario', key: 'username', width: 20 },
      { header: 'Nombre Completo', key: 'fullname', width: 25 },
      { header: 'Cargo', key: 'position', width: 20 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 }
    ];
    this.excelExportService.exportToExcel(columns, this.dataSource.data, 'Usuarios');
  }
}








