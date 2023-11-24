import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, Role } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

export class RolesComponent implements OnInit, AfterViewInit {
  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<Role>;
  public isLoading = true;
  public Item: any = {};
  public create = false;
  public edit = false;
  public double = false;
  public detail = false;

  public Columns: { [key: string]: string } = {
    /*     id: 'ID', */
    name: 'Nombre',
    /*     menus: 'Menús', */
    /*     permits: 'Permisos', */
    description: 'Descripción',
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService
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
        empresaId: this.dataEmpresa.id,
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

  refresh() {
    this.isLoading = true;
    this.cacheService.remove('Roles');
    this.dataService.fetchRoles('GET');
  }

  ExportToExcel() {
    const columns = [
      { header: 'Nombre', key: 'name', width: 20 },
      { header: 'Menús', key: 'menus', width: 25 },
      { header: 'Descripción', key: 'description', width: 30 }
    ];

    const dataCopy = this.dataSource.data.map(row => ({
      ...row,
      menus: this.menusHabilitados(row.menus)
    }));

    this.excelExportService.exportToExcel(columns, dataCopy, 'Roles');
  }

  private menusHabilitados(jsonString: string): string {
    const lista = JSON.parse(jsonString);
    // Filtrar los elementos habilitados y extraer sus nombres
    const nombresHabilitados = lista
      .filter((item: any) => item.habilitado)
      .map((item: any) => item.name);
    return nombresHabilitados.join(', ');
  }
}






