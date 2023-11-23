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
    remito.comprobante = primerItem.invoice;
    remito.descripcion = primerItem.description;
    remito.moneda = primerItem.currency;

    remito.items = itemsConsolidados.map(item => ({
      nombre: this.getInventario_Nombre(item.idInventario, inventario),
      codigo: this.getInventario_Codigos(item.idInventario, inventario),
      descripcion: this.getInventario_Descripcion(item.idInventario, inventario),
      cantidad: item.cantidad,
      precio: parseFloat(parseFloat(item.amount).toFixed(2))
    }));

    remito.total = parseFloat(parseFloat(this.TotalRemito(itemRemito)).toFixed(2));
    return remito;
  }

  private consolidateItems(itemRemito: moneyIncome[]): any[] {
    const consolidatedItems: any[] = [];
    for (const ingreso of itemRemito) {
      const existingItem = consolidatedItems.find((item) => item.idInventario === ingreso.idInventario && item.amount === ingreso.amount);
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
      total += ingreso.amount ? ingreso.amount : 0;
    }
    return total.toString();
  }

  private _getProduct(idInventario: any, inventario: Inventario[]): Inventario {
    if (idInventario)
      return inventario.filter(item =>
        item.id?.toString().toLowerCase() === idInventario?.toString().toLowerCase()
      )[0];
    else return null!;
  }

  public generateAndDownloadPDF(remito: Remito) {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Remito', style: 'header' },
        {
          columns: [
            {
              width: '50%',
              text: `Fecha: ${remito.fecha}\nCliente: ${remito.cliente || ''}\nMétodo de Pago: ${remito.metodoPago}\nComprobante: ${remito.comprobante || ''}\nDescripción: ${remito.descripcion || ''}`,
            },
            {
              // Columna derecha vacía para mantener la alineación
              width: '50%',
              text: ''
            }
          ]
        },
        { text: 'Ítems', style: 'subheader' },
        {
          // Lista de ítems
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Nombre', 'Código', 'Cantidad', 'Precio'],
              ...remito.items.map(item => [item.nombre, item.codigo, 'x' + item.cantidad, '$' + item.precio.toFixed(2)])
            ]
          }
        },
        {
          // Total al final y alineado a la derecha
          text: `Total (${remito.moneda}): $${remito.total.toFixed(2)}`,
          alignment: 'right',
          style: 'totalStyle'
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        totalStyle: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 0]
        }
      }
    };

    const pdf = pdfMake.createPdf(docDefinition, undefined, pdfMake.fonts, pdfFonts.pdfMake.vfs);
    pdf.download('R-' + Date.now().toString() + '.pdf');
  }
}


