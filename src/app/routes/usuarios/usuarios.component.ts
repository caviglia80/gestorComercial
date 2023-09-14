import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { User } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<User>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    username: 'Usuario',
    fullname: 'Nombre completo',
    cellphone: 'Teléfono',
    email: 'Correo',
    password: 'Contraseña',
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

  public viewItem(item: User) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: User) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public deleteItem(item: User) {
    this.dataService.fetchUsuarios('DELETE', { id: item.id, username: item.username });
  }

  private rellenarRecord(item: User) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.username = item.username;
    this.Item.fullname = item.fullname;
    this.Item.cellphone = item.cellphone;
    this.Item.email = item.email;
    this.Item.password = '';
  }

  public createRecord() {
    try {
      const body: any = {
        id: this.Item.id,
        username: this.Item.username != 0 ? this.Item.username : " ",
        fullname: this.Item.fullname != 0 ? this.Item.fullname : " ",
        cellphone: this.Item.cellphone != 0 ? this.Item.cellphone : " ",
        email: this.Item.email != 0 ? this.Item.email : " ",
        password: this.Item.password != 0 ? this.Item.password : " "
      };
      this.dataService.fetchUsuarios('POST', body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
    }
  }

  public editRecord() {
    try {
      const body: any = {
        id: this.Item.id,
        username: this.Item.username != 0 ? this.Item.username : " ",
        fullname: this.Item.fullname != 0 ? this.Item.fullname : " ",
        cellphone: this.Item.cellphone != 0 ? this.Item.cellphone : " ",
        email: this.Item.email != 0 ? this.Item.email : " ",
        password: this.Item.password != 0 ? this.Item.password : " "
      };
      this.dataService.fetchUsuarios('PUT', body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Edit(false);
    }
  }
}






