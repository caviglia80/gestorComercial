import { moneyIncome, Inventario } from '@models/mainClasses/main-classes';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export interface ProductoRemito {
  nombre: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
}
export class Remito {
  fecha: string;
  cliente?: string;
  metodoPago: string;
  comprobante?: string;
  descripcion?: string;
  moneda: string;
  total: number;
  items: ProductoRemito[];

  constructor(
    fecha = '',
    cliente = '',
    metodoPago = '',
    comprobante = '',
    descripcion = '',
    moneda = '',
    total = 0,
    items: ProductoRemito[] = [],
  ) {
    this.fecha = fecha;
    this.cliente = cliente;
    this.metodoPago = metodoPago;
    this.comprobante = comprobante;
    this.descripcion = descripcion;
    this.moneda = moneda;
    this.total = total;
    this.items = items;
  }

  public getRemito(itemRemito: moneyIncome[], inventario: Inventario[]): Remito {
    let remito: Remito = new Remito();

    const itemsConsolidados = this.consolidateItems(itemRemito);

    const primerItem = itemsConsolidados[0];
    remito.fecha = primerItem.date;
    remito.cliente = primerItem.cliente;
    remito.metodoPago = primerItem.method;
    remito.comprobante = primerItem.comprobante;
    remito.descripcion = primerItem.description;
    remito.moneda = primerItem.moneda;

    remito.items = itemsConsolidados.map(item => ({
      nombre: this.getInventario_Nombre(item.inventarioId, inventario),
      codigo: this.getInventario_Codigos(item.inventarioId, inventario),
      descripcion: this.getInventario_Descripcion(item.inventarioId, inventario),
      cantidad: item.cantidad,
      precio: parseFloat(parseFloat(item.monto).toFixed(2))
    }));

    remito.total = parseFloat(parseFloat(this.TotalRemito(itemRemito)).toFixed(2));
    return remito;
  }

  private consolidateItems(itemRemito: moneyIncome[]): any[] {
    const consolidatedItems: any[] = [];
    for (const ingreso of itemRemito) {
      const existingItem = consolidatedItems.find((item) => item.inventarioId === ingreso.inventarioId && item.monto === ingreso.monto);
      if (existingItem) {
        existingItem.cantidad += 1;
      } else {
        consolidatedItems.push({ ...ingreso, cantidad: 1 });
      }
    }
    return consolidatedItems;
  }

  private getInventario_Nombre(id: any, inventario: Inventario[]): string {
    const i: Inventario = this._getProduct(id, inventario);
    if (i)
      return i.nombre;
    else
      return id.toString();
  }

  private getInventario_Codigos(id: any, inventario: Inventario[]): string {
    const i: Inventario = this._getProduct(id, inventario);
    if (i)
      if (i.idExterno)
        return i.id?.toString() + ' - ' + i.idExterno?.toString();
      else
        return i.id?.toString();
    else
      return '...';
  }

  private getInventario_Descripcion(id: any, inventario: Inventario[]): string {
    const i: Inventario = this._getProduct(id, inventario);
    if (i)
      return i.descripcion ? i.descripcion : '';
    else
      return '...';
  }

  private TotalRemito(itemRemito: moneyIncome[]): string {
    let total = 0;
    for (const ingreso of itemRemito) {
      total += ingreso.monto ? ingreso.monto : 0;
    }
    return total.toString();
  }

  private _getProduct(inventarioId: any, inventario: Inventario[]): Inventario {
    if (inventarioId)
      return inventario.filter(item =>
        item.id?.toString().toLowerCase() === inventarioId?.toString().toLowerCase()
      )[0];
    else return null!;
  }


  public generateAndDownloadPDF(remito: Remito, comprobante: string = '') {
    // Define un estilo base para el documento
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Remito' + (comprobante ? ('-' + comprobante) : ''), style: 'header' },
        ...this.getDetails(remito),
        this.getTable(remito),
        {
          // Total al final y alineado a la derecha
          text: `Total (${remito.moneda}): $${remito.total.toFixed(2)}`,
          alignment: 'right',
          style: 'totalStyle'
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        totalStyle: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 0]
        }
      }
    };

    const pdf = pdfMake.createPdf(docDefinition, undefined, pdfMake.fonts, pdfFonts.pdfMake.vfs);
    pdf.download('R-' + comprobante + '.pdf');
  }

  private getDetails(remito: Remito) {
    const details = [
      { text: `Fecha: ${remito.fecha}`, style: 'normal' },
      { text: `Cliente: ${remito.cliente || ''}`, style: 'normal' },
      { text: `Método de Pago: ${remito.metodoPago}`, style: 'normal' },
      { text: `Descripción: ${remito.descripcion || ''}`, style: 'normal' },
      { text: `Moneda: ${remito.moneda}`, style: 'normal' }
    ];
    return details;
  }

  private getTable(remito: Remito) {
    return {
      style: 'normal',
      table: {
        headerRows: 1,
        widths: ['*', '*', 'auto', 'auto'],
        body: [
          [
            { text: 'Nombre', style: 'subheader' },
            { text: 'Código', style: 'subheader' },
            { text: 'Cantidad', style: 'subheader' },
            { text: 'Precio', style: 'subheader' }
          ],
          ...remito.items.map(item => [
            this.truncateText(item.nombre, 30), // Ajusta el 25 según sea necesario
            this.truncateText(item.codigo, 30), // Ajusta el 15 según sea necesario
            item.cantidad.toString(),
            `$${item.precio.toFixed(2)}`
          ])
        ],
      },
      layout: {
        hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length ? 2 : 1),
        vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length ? 2 : 1),
        hLineColor: (i: number) => (i === 0 || i === 1 ? 'black' : 'gray'),
        vLineColor: (i: number) => (i === 0 || i === 1 ? 'black' : 'gray'),
      }
    };
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength)
      return text.substring(0, maxLength - 3) + '...';
    return text;
  }
}


