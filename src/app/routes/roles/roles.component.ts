import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Role } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

export class RolesComponent implements AfterViewInit {
  public dataSource = new MatTableDataSource<Role>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public double: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    name: 'Nombre',
    /*     menus: 'Menús', */
    /*     permits: 'Permisos', */
    description: 'Descripción',
    actions: 'Operaciones'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    public sharedService: SharedService
  ) { }

  public menusHabilitacion: { id: string, name: string, habilitado: boolean }[] = [
    { id: 'xxx', name: 'Panel', habilitado: true },
    { id: 'xxx', name: 'Ingresos', habilitado: true },
    { id: 'xxx', name: 'Egresos', habilitado: true },
    { id: 'xxx', name: 'Inventario', habilitado: true },
    { id: 'xxx', name: 'Proveedores', habilitado: true },
    { id: 'xxx', name: 'Facturación', habilitado: true },
    { id: 'xxx', name: 'Reportes', habilitado: true },
    { id: 'xxx', name: 'General', habilitado: true },
    { id: 'xxx', name: 'Usuarios', habilitado: true },
    { id: 'xxx', name: 'Roles', habilitado: true }
  ];

  public menusHabilitacion_reset() {
    for (let i = 0; i < this.menusHabilitacion.length; i++) {
      this.menusHabilitacion[i].habilitado = true;
    }
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Roles$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchRoles('GET');
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

  public Double(visible: boolean) {
    this.Item = {};
    this.double = visible;
  }

  public Create(visible: boolean) {
    this.menusHabilitacion_reset();
    this.Item = {};
    this.create = visible;
  }

  public viewItem(item: Role) {
    this.menusHabilitacion_reset();
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Role) {
    this.menusHabilitacion_reset();
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public duplicateItem(item: Role) {
    this.menusHabilitacion_reset();
    this.Double(true);
    const originalName: string = item.name;
    item.name = 'Duplicado - ' + item.name;
    this.rellenarRecord(item);
    item.name = originalName;
  }

  public deleteItem(item: Role) {
    this.dataService.fetchRoles('DELETE', { id: item.id, name: item.name });
  }

  private rellenarRecord(item: Role) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.name = item.name;
    this.menusHabilitacion = JSON.parse(item.menus);
    this.Item.permits = '';
    this.Item.description = item.description;
  }

  public record(method: string) {
    try {
      const body: Role = {
        id: this.Item.id,
        name: this.Item.name,
        menus: JSON.stringify(this.menusHabilitacion),
        permits: this.Item.permits,
        description: this.Item.description
      };
      this.dataService.fetchRoles(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
      this.Double(false);
    }
  }
}






