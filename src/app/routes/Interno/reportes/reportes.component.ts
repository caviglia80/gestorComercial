import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelExportService } from '@services/excel-export/excel-export.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportsComponent {
  public selectedTabIndex: number = 0;
  public filtro = new FormControl('rubro');
  public dataSourceIngresos = new MatTableDataSource<any>;
  public dataSourceERubro = new MatTableDataSource<any>;
  public dataSourceEBP = new MatTableDataSource<any>;

  constructor(
    private excelExportService: ExcelExportService
  ) { }

  getDataIngresos(valor: any) {
    this.dataSourceIngresos = valor;
  }
  getDataERubro(valor: any) {
    this.dataSourceERubro = valor;
  }
  getDataEBP(valor: any) {
    this.dataSourceEBP = valor;
  }

  ExportToExcel() {
    let name = 'Reporte';
    let columns;

    if (this.selectedTabIndex === 0) {                                             // INGRESOS
      columns = [
        { header: 'ID Inventario', key: 'id', width: 5 },
        { header: 'Nombre Inventario', key: 'name', width: 50 },
        { header: 'Cantidad Ingresos ', key: 'cantidadIngresos', width: 20 },
        { header: 'Total Ingresos', key: 'totalIngresos', width: 20 },
        { header: 'Margen Ganancias', key: 'margenGanancias', width: 20 }
      ];
      this.excelExportService.exportToExcel(columns, this.dataSourceIngresos.data, name + '-Ingresos');
    } else if (this.selectedTabIndex === 1 && this.filtro.value === 'rubro') {    // Egresos por Rubro
      columns = [
        { header: 'Rubro', key: 'rubro', width: 40 },
        { header: 'Cantidad de Egresos', key: 'cantidadEgresos', width: 20 },
        { header: 'Monto Total', key: 'montoTotalEgresos', width: 20 }
      ];
      this.excelExportService.exportToExcel(columns, this.dataSourceERubro.data, name + '-EgresosPorRubro');
    } else if (this.selectedTabIndex === 1 && this.filtro.value === 'bp') {       // Egresos por Beneficiario/Proveedor
      columns = [
        { header: 'Beneficiario', key: 'bp', width: 30 },
        { header: 'Cantidad de Egresos', key: 'cantidadEgresos', width: 20 },
        { header: 'Monto Total', key: 'montoTotalEgresos', width: 20 }
      ];
      this.excelExportService.exportToExcel(columns, this.dataSourceEBP.data, name + '-EgresosPorBeneficiario');
    }
  }
}
