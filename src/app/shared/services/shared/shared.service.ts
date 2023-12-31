import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public static isProduction = environment.production;
  public static host = environment.production ? 'php/' : 'http://test.cavigliayasociados.com.ar/php/'; /* localhost/ */
  public static proxy = 'https://cors-anywhere.herokuapp.com/';
  public monedas: string[] = [
    'ARS'
  ];
  public paidMethods: string[] = [
    'Efectivo',
    'Tarjeta de crédito',
    'Tarjeta de débito',
    'Transferencia bancaria',
    'Mercado Pago',
    'Cheque',
    'Pago Fácil',
    'Rapipago',
    'PayPal',
    'Ualá',
    'Otro'
  ];
  public rubrosIngresos: string[] = [
    'Ventas',
    'Extraordinarios',
    'Otra Actividad'
  ];
  public rubrosEgresos: string[] = [
    'Compras',
    'Extraordinarios',
    'Otra Actividad'
  ];
  public inventarioTipos: string[] = [
    'Producto',
    'Servicio'
  ];
  private notificationQueue: { text: string; action?: string }[] = [];
  private isNotificationDisplayed = false;
  private snackBarRef: MatSnackBarRef<any> | null = null;

  constructor(
    private snackBar: MatSnackBar
  ) { }

  public message(text: string, action = 'Cerrar') {
    if (!environment.production) {
      this.notificationQueue.push({ text, action });
      if (!this.isNotificationDisplayed)
        this.showNextNotification();
    }
  }

  private showNextNotification() {
    if (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      if (notification) {
        const { text, action } = notification;
        this.isNotificationDisplayed = true;
        this.snackBarRef = this.snackBar.open(text, action, {
          duration: 1500,
        });
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.isNotificationDisplayed = false;
          this.showNextNotification();
        });
      }
    }
  }

  public async copy(textToCopy: any) {
    try {
      await navigator.clipboard.writeText(textToCopy)
      this.message('Texto copiado !');
    } catch { }
  }

  public rellenoCampos_IE(type: string): any {
    const Item: any = {};
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const dd = String(today.getDate()).padStart(2, '0');
    Item.date = `${yyyy}-${mm}-${dd}`;
    if (this.monedas.length > 0)
      Item.moneda = this.monedas[0];
    if (this.paidMethods.length > 0)
      Item.method = this.paidMethods[0];
    if (type === 'i')
      if (this.rubrosIngresos.length > 0)
        Item.category = this.rubrosIngresos[0];
    if (type === 'e')
      if (this.rubrosEgresos.length > 0)
        Item.category = this.rubrosEgresos[0];
    return Item;
  }

  public obtenerFechaPrimerDiaDelMes(): string {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const año = primerDiaMes.getFullYear().toString();
    const mes = (primerDiaMes.getMonth() + 1).toString().padStart(2, '0');
    const dia = primerDiaMes.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  public obtenerFechaUltimoDiaDelMes(): string {
    const hoy = new Date();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    const año = ultimoDiaMes.getFullYear().toString();
    const mes = (ultimoDiaMes.getMonth() + 1).toString().padStart(2, '0');
    const dia = ultimoDiaMes.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  public isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  public getPrecioLista(costo: number, margenBeneficio: number): number {
    return (costo * (1 + margenBeneficio / 100));
  }

  public isValidEmail(correo: string): boolean {
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regexCorreo.test(correo);
  }

  public onlyUser(correo: string): string {
    return correo.split('@')[0];
  }

  public fechaFormateada(fecha: string): string {
    const fechaObjeto = new Date(fecha);
    const año = fechaObjeto.getFullYear();
    const mes = fechaObjeto.getMonth() + 1;
    const dia = fechaObjeto.getDate();

    const fechaFormateada = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${año}`;
    return fechaFormateada;
  }

  public getDiasDeDiferencia(fecha: string): number {
    const fechaObjeto = new Date(fecha);
    const fechaActual = new Date();
    const diferenciaMs = fechaObjeto.getTime() - fechaActual.getTime();
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  }

  public getDiasMesesDiferencia(ultimaFecha: string, fechaHasta: string): string {
    const fechaHastaObjeto = new Date(fechaHasta);
    const ultimaFechaObjeto = new Date(ultimaFecha);
    const fechaActual = new Date();
    let fechaDesde = new Date();

    if (fechaActual > ultimaFechaObjeto)
      fechaDesde = fechaActual;
    else
      fechaDesde = ultimaFechaObjeto;

    const diferenciaMs = fechaHastaObjeto.getTime() - fechaDesde.getTime();
    const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

    const meses = Math.floor(diferenciaDias / 30);
    const dias = diferenciaDias % 30;

    let resultado = "";
    if (meses > 0) resultado += `${meses} mes${meses > 1 ? 'es' : ''} `;
    if (dias > 0) resultado += `${dias} día${dias > 1 ? 's' : ''}`;

    return resultado.trim();
  }

}


