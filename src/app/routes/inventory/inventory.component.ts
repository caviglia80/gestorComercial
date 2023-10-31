import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Inventario, proveedor } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})

export class InventoryComponent implements AfterViewInit {
  public proveedorControl = new FormControl();
  public proveedorFiltered: Observable<any[]>;
  public proveedorData: proveedor[] = [];

  public dataSource = new MatTableDataSource<Inventario>;
  public isLoading = true;
  public Item: any = {};
  public create: boolean = false;
  public edit: boolean = false;
  public double: boolean = false;
  public detail: boolean = false;

  public Columns: { [key: string]: string } = {
    id: 'ID',
    idExterno: 'ID Externo',
    nombre: 'Nombre',
    tipo: 'Tipo',
    listPrice: 'Precio lista',
    /*     existencias: 'Existencias', */
    /*     margenBeneficio: 'Margen-Beneficio', */
    actions: 'Operaciones'
  };

  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    public sharedService: SharedService
  ) {
    this.proveedorFiltered = this.proveedorControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProveedor(value))
    );
   }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataInit();
    this.dataInit_Proveedor();
  }

  private dataInit() {
    this.dataService.Inventario$.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading(false);
      },
      error: () => {
        this.loading(false);
      }
    });
    this.dataService.fetchInventario('GET');
  }

  private dataInit_Proveedor() {
    this.dataService.Proveedores$.subscribe((data) => {
      this.proveedorData = data;
    });
    this.getProveedor();
  }

  public getProveedor() {
    this.dataService.fetchProveedores('GET');
  }

  private _filterProveedor(value: string): any[] {
    if (this.proveedorData.length === 0)
      this.getProveedor();
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.proveedorData.filter(item =>
        item.company.toLowerCase().includes(filterValue) ||
        item.contactFullname.toString().toLowerCase().includes(filterValue)
      );
    } else return [];
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
    this.Item = {};
    this.create = visible;
  }

  public viewItem(item: Inventario) {
    this.Detail(true);
    this.rellenarRecord(item);
  }

  public editItem(item: Inventario) {
    this.Edit(true);
    this.rellenarRecord(item);
  }

  public duplicateItem(item: Inventario) {
    this.Double(true);
    const originalExternalID: string = item.idExterno == null ? "" : item.idExterno;
    item.idExterno = 'Duplicado - ' + item.idExterno;
    this.rellenarRecord(item);
    item.idExterno = originalExternalID;
  }

  public deleteItem(item: Inventario) {
    this.dataService.fetchInventario('DELETE', { id: item.id, nombre: item.nombre });
  }

  private rellenarRecord(item: Inventario) {
    this.Item = {};
    this.Item.id = item.id;
    this.Item.idExterno = item.idExterno;
    this.Item.nombre = item.nombre;
    this.Item.existencias = item.existencias;
    this.Item.costo = item.costo;
    this.Item.margenBeneficio = item.margenBeneficio;
    this.Item.tipo = item.tipo;
    this.Item.proveedor = item.proveedor;
    this.Item.duracion = item.duracion;
    this.Item.categoria = item.categoria;
    this.Item.descripcion = item.descripcion;
  }

  public record(method: string) {
    try {
      const body: Inventario = {
        id: this.Item.id,
        idExterno: this.Item.idExterno,
        nombre: this.Item.nombre,
        existencias: this.Item.existencias == null ? 0 : this.Item.existencias,
        costo: this.Item.costo == null ? 0 : this.Item.costo,
        margenBeneficio: this.Item.margenBeneficio == null ? 0 : this.Item.margenBeneficio,
        tipo: this.Item.tipo,
        proveedor: this.Item.proveedor,
        duracion: this.Item.duracion,
        categoria: this.Item.categoria,
        descripcion: this.Item.descripcion
      };
      this.dataService.fetchInventario(method, body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Create(false);
      this.Edit(false);
      this.Double(false);
    }
  }

}






