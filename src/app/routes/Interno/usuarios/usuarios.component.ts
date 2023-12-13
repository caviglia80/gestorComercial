import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, User, Rol } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';
import { FormControl } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit, AfterViewInit {
  public rolesControl = new FormControl();
  public rolesData: Rol[] = [];

  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<User>;
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public detail = false;
  public correoEnUso = false;
  public rol = '';

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    username: 'Usuario',
    fullname: 'Nombre completo',
    phone: 'Teléfono',
    email: 'Correo',
    /*     password: 'Contraseña', */
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService,
    private authService: AuthService
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

    this.dataService.Roles$.subscribe((data) => {
      this.rolesData = data;
    });
    this.getRoles();
  }

  public getRoles() {
    this.dataService.fetchRoles('GET');
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
    this.Item.administrador = item.administrador;
    this.Item.rolId = item.rolId;
    // this.rol = this.rolesData.find(item => item.id === this.Item.rolId)?.nombre || 'Desconocido.';
    this.rol = item.administrador == '1' ? 'Administrador' : this.rolesData.find(rol => rol.id === item.rolId)?.nombre || 'Desconocido';
    this.Item.username = item.username;
    this.Item.fullname = item.fullname;
    this.Item.phone = item.phone;
    this.Item.email = item.email;
    this.Item.password = '';
  }

  public record(method: string) {
    this.correoEnUso = false;
    if (this.dataSource.data.some(usuario => usuario.email === this.Item.email) && method === 'POST') {
      this.correoEnUso = true;
      return;
    }
    try {
      const body: User = {
        id: this.Item.id,
        empresaId: this.dataEmpresa.id,
        administrador: this.Item.administrador,
        rolId: this.Item.rolId,
        username: this.Item.username,
        fullname: this.Item.fullname,
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
      this.authService.refreshUserInfo();
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
      { header: 'Nombre Completo', key: 'fullname', width: 30 },
      { header: 'Rol', key: 'rolId', width: 25 },
      { header: 'Teléfono', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 30 }
    ];

    const datosMapeados = this.dataSource.data.map(item => {
      return {
        ...item,
        rolId: item.administrador == '1' ? 'Administrador' : this.rolesData.find(rol => rol.id === item.rolId)?.nombre || 'Desconocido'
      };
    });
    this.excelExportService.exportToExcel(columns, datosMapeados, 'Usuarios');
  }
}








