import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, Usuario, Rol } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public rolesData: Rol[] = [];

  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<Usuario>;
  public isLoading = true;
  public create = false;
  public edit = false;
  public detail = false;
  public correoEnUso = false;

  public Item: any = {
    id: new FormControl(0),
    administrador: new FormControl(''),
    rolId: new FormControl(0),
    rol: new FormControl(''),
    username: new FormControl('', Validators.required),
    fullname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(7)]),
  };

  public Columns: { [key: string]: string } = {
    username: 'Usuario',
    fullname: 'Nombre completo',
    phone: 'Teléfono',
    email: 'Correo',
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

    this.dataService.Usuarios$.subscribe({
      next: (data) => {
        if (data) {
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
    this.resetItemFormControls();
    this.detail = visible;
  }

  public Edit(visible: boolean) {
    this.resetItemFormControls();
    if (visible) this.Item.email.disable(); else this.Item.email.enable();
    this.edit = visible;
  }

  public Create(visible: boolean) {
    this.resetItemFormControls();
    this.Item.email.enable();
    this.create = visible;
  }

  public viewItem(item: Usuario) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Usuario) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: Usuario) {
    this.dataService.fetchUsuarios('DELETE', { id: item.id });
  }

  resetItemFormControls() {
    Object.keys(this.Item).forEach(key => {
      this.Item[key].reset();
    });
  }

  private rellenarRecord(item: any) {
    this.resetItemFormControls();
    Object.keys(this.Item).forEach(key => {
      if (key === 'rol')
        this.Item[key].patchValue(item.administrador == '1' ? 'Administrador' : this.rolesData.find(rol => rol.id === item.rolId)?.nombre || 'Desconocido');
      else
        this.Item[key].patchValue(item[key] || '');
    });
  }

  public record(method: string) {
    this.correoEnUso = false;
    if (this.dataSource.data.some(usuario => usuario.email === this.Item.email) && method === 'POST') {
      this.correoEnUso = true;
      return;
    }
    try {
      const body: Usuario = {
        id: this.Item.id.value,
        username: this.Item.username.value,
        fullname: this.Item.fullname.value,
        phone: this.Item.phone.value,
        email: this.Item.email.value,
        password: this.Item.password.value
      };

      if (!this.Item.administrador.value)
        body.rolId = this.Item.rolId.value;

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
    this.loading(true);
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








