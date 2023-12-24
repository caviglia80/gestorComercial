import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { empresa, Usuario } from '@models/mainClasses/main-classes';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { CacheService } from '@services/cache/cache.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  public Administradores: Usuario[] = [];
  public dataSource = new MatTableDataSource<empresa>;
  public isLoading = true;
  public Item: any = {};
  public ItemTmp: any = {};
  public detail = false;
  public edit = false;
  public difFechaMsj: string = '';

  public Columns: { [key: string]: string } = {
    id: 'ID',
    nombre: 'Nombre Empresa',
    email: 'Administrador',
    fechaVencimiento: 'Vencimiento',
    actions: 'Operaciones'
  };

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private cacheService: CacheService
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
    this.dataService.Sa$.subscribe({
      next: (data) => {
        if (data && data.length) {
          this.Administradores = data.administradores;
          const enrichedData = data.empresas.map((empresa: empresa) => {
            const admin = this.Administradores.find(admin => admin.id === empresa.usuarioId);
            return { ...empresa, email: admin ? admin.email : '' };
          });
          this.dataSource.data = enrichedData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading(false);
        }
      },
      error: () => {
        this.loading(false);
      }
    });
    this.loading(true);
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
    this.ItemTmp = {};
    this.difFechaMsj = '';
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

    const admin: Usuario | null = this.Administradores.find(user => user.id === item.usuarioId) || null;
    if (admin) {
      this.Item.adminId = admin.id;
      this.Item.adminUsername = admin.username;
      this.Item.adminFullname = admin.fullname;
      this.Item.adminEmail = admin.email;
      this.Item.adminEmpresaId = admin.empresaId;
      this.Item.adminPhone = admin.phone;
    }

    this.ItemTmp.fechaVencimiento = item.fechaVencimiento;
    this.ItemTmp.adminEmail = this.Item.adminEmail;
  }

  public record() {
    try {
      const body: any = {
        empresaId: this.Item.id || null,
        fechaVencimiento: this.Item.fechaVencimiento !== this.ItemTmp.fechaVencimiento
          ? this.Item.fechaVencimiento || null
          : null,

        usuarioId: this.Item.usuarioId || null,
        email: this.Item.adminEmail !== this.ItemTmp.adminEmail
          ? this.Item.adminEmail || null
          : null,
        password: this.Item.clave || null
      };

      this.dataService.fetchSa('PUT', body);
    } catch (error) {
      console.error('Se ha producido un error:', error);
    } finally {
      this.Edit(false);
    }
  }

  refresh() {
     this.loading(true);
    this.cacheService.remove('Sa');
    this.dataService.fetchSa('GET');
  }

  getAdmin(usuarioId: number): Usuario | null {
    return this.Administradores.find(user => user.id === usuarioId) || null;
  }

  colorearFecha(fecha: string): string {
    const diferenciaDias = this.sharedService.getDiasDeDiferencia(fecha);
    if (diferenciaDias <= 0) {
      return 'red';
    } else if (diferenciaDias <= 5) {
      return 'orange';
    } else if (diferenciaDias >= 6) {
      return '#00C000';
    } else {
      return 'black';
    }
  }

  mostrarDiferenciaDeFechas(ultimaFecha: string, fechaHasta: string) {
    this.difFechaMsj = this.sharedService.getDiasMesesDiferencia(ultimaFecha, fechaHasta);
  }
}








