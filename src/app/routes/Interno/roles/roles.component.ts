import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, Rol } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
import { ExcelExportService } from '@services/excel-export/excel-export.service';
import { AuthService } from '@services/auth/auth.service';
import { FormControl, Validators } from '@angular/forms';
interface Menu {
  ruta: string;
  nombre: string;
  habilitado: boolean;
}
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

export class RolesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public dataEmpresa: empresa = new empresa();
  public dataSource = new MatTableDataSource<Rol>;
  public isLoading = true;

  public create = false;
  public edit = false;
  public double = false;
  public detail = false;

  public Item: any = {
    id: new FormControl(0),
    nombre: new FormControl('', Validators.required),
    permisos: new FormControl(''),
    descripcion: new FormControl('')
  };

  public Columns: { [key: string]: string } = {
    nombre: 'Nombre',
    descripcion: 'Descripción',
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService,
    private excelExportService: ExcelExportService,
    private authService: AuthService
  ) { }

  public menusHabilitacion: Menu[] = [
    { "ruta": "/nav/dashboard", "nombre": "Panel", "habilitado": false },
    { "ruta": "/nav/ingresos", "nombre": "Ingresos", "habilitado": false },
    { "ruta": "/nav/egresos", "nombre": "Egresos", "habilitado": false },
    { "ruta": "/nav/inventario", "nombre": "Inventario", "habilitado": false },
    { "ruta": "/nav/proveedores", "nombre": "Proveedores", "habilitado": false },
    { "ruta": "/nav/reportes", "nombre": "Reportes", "habilitado": false },
    { "ruta": "/nav/general", "nombre": "General", "habilitado": false },
    { "ruta": "/nav/usuarios", "nombre": "Usuarios", "habilitado": false },
    { "ruta": "/nav/renovacion", "nombre": "Renovación", "habilitado": false },
    { "ruta": "/nav/roles", "nombre": "Roles", "habilitado": false }
  ];

  public menusHabilitacion_reset() {
    for (let i = 0; i < this.menusHabilitacion.length; i++) {
      this.menusHabilitacion[i].habilitado = true;
    }
  }

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

    this.dataService.Roles$.subscribe({
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
    this.edit = visible;
  }

  public Double(visible: boolean) {
    this.resetItemFormControls();
    this.double = visible;
  }

  public Create(visible: boolean) {
    this.menusHabilitacion_reset();
    this.resetItemFormControls();
    this.create = visible;
  }

  public viewItem(item: Rol) {
    this.menusHabilitacion_reset();
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Rol) {
    this.menusHabilitacion_reset();
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public duplicateItem(item: Rol) {
    this.menusHabilitacion_reset();
    this.Double(true);
    const originalName: string = item.nombre;
    item.nombre = 'Duplicado - ' + item.nombre;
    this.rellenarRecord(item);
    item.nombre = originalName;
  }

  public deleteItem(item: Rol) {
    this.dataService.fetchRoles('DELETE', { id: item.id, nombre: item.nombre });
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
    this.menusHabilitacion = JSON.parse(item.menus);
  }

  public record(method: string) {
    try {
      const body: Rol = {
        id: this.Item.id.value,
        empresaId: this.dataEmpresa.id,
        nombre: this.Item.nombre.value,
        menus: JSON.stringify(this.menusHabilitacion),
        permisos: this.Item.permisos.value,
        descripcion: this.Item.descripcion.value
      };
      this.dataService.fetchRoles(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
      this.Double(false);
      this.authService.refreshUserInfo();
    }
  }

  refresh() {
    this.loading(true);
    this.cacheService.remove('Roles');
    this.dataService.fetchRoles('GET');
  }

  ExportToExcel() {
    const columns = [
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Menús', key: 'menus', width: 80 },
      { header: 'Descripción', key: 'descripcion', width: 30 }
    ];

    const dataCopy = this.dataSource.data.map(row => ({
      ...row,
      menus: this.menusHabilitados(row.menus)
    }));

    this.excelExportService.exportToExcel(columns, dataCopy, 'Roles');
  }

  private menusHabilitados(jsonString: string): string {
    return JSON
      .parse(jsonString)
      .filter((item: any) => item.habilitado)
      .map((item: any) => item.nombre)
      .join(', ');
  }
}






