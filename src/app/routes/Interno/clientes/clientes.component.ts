import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, User } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';
import { FormControl } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit, AfterViewInit {
  public Administradores: User[] = [];
  public dataSource = new MatTableDataSource<empresa>;
  public isLoading = true;
  public Item: any = {};
  public detail = false;
  public edit = false;

  public Columns: { [key: string]: string } = {
    id: 'ID',
    nombre: 'Nombre Empresa',
    usuarioId: 'Usuario',
    fechaVencimiento: 'Vencimiento',
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
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
    this.dataService.Sa$.subscribe({
      next: (data) => {
        if (data && data.lenght !== 0) {
          this.dataSource.data = data.empresas;
          this.Administradores = data.administradores;
          this.loading(false);
        }
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchSa('GET');
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

  public viewItem(item: any) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: any) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  private rellenarRecord(item: any) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.nombre = item.nombre;
    this.Item.usuarioId = item.usuarioId;
    this.Item.fechaVencimiento = item.fechaVencimiento;

    const admin: User | null = this.Administradores.find(user => user.id === item.usuarioId) || null;
    if (admin) {
      this.Item.adminId = admin.id;
      this.Item.adminUsername = admin.username;
      this.Item.adminFullname = admin.fullname;
      this.Item.adminEmail = admin.email;
      this.Item.adminEmpresaId = admin.empresaId;
      this.Item.adminPhone = admin.phone;
    }
  }

  public record(method: string) {
    //  try {
    //    const body: User = {
    //      id: this.Item.id,
    //      empresaId: this.dataEmpresa.id,
    //      administrador: this.Item.administrador,
    //      rolId: this.Item.rolId,
    //      username: this.Item.username,
    //      fullname: this.Item.fullname,
    //      phone: this.Item.phone,
    //      email: this.Item.email,
    //      password: this.Item.password
    //    };
    //
    //    this.dataService.fetchUsuarios(method, body);
    //  } catch (error) {
    //    console.error('Se ha producido un error:', error);
    //  } finally {
    //    this.Edit(false);
    //  }
  }

  refresh() {
    this.isLoading = true;
    this.cacheService.remove('Sa');
    this.dataService.fetchSa('GET');
  }

}








