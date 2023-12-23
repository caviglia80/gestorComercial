import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

interface Column {
  header: string;
  key: string;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  async exportToExcel(columns: Column[], data: any[], fileName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    // Añadir cabeceras de columna
    worksheet.columns = columns;

    // Estilo de cabecera: negrita y bordes
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Añadir datos
    data.forEach((row) => {
      // Crear un array que respete el orden y la estructura de las columnas
      const rowData = columns.map(column => row[column.key]);
      worksheet.addRow(rowData);
    });

    // Escribir archivo
    const buffer = await workbook.xlsx.writeBuffer();
    this.downloadExcel(buffer, fileName);
  }

  private downloadExcel(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}
