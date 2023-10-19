import { Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DataService } from '@services/data/data.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public static isProduction = environment.production;
  public static host: string = 'https://francisco-caviglia.com.ar/francisco-caviglia/php/'; /* localhost/ */
  public static proxy: string = 'https://cors-anywhere.herokuapp.com/';
  public currencys: string[] = [
    'ARS',
    'USD',
    'EUR'
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
    'Débito automático',
    'PayPal',
    'Ualá',
    'Bitcoin',
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
    'Otra Actividad'];
  public inventarioTipos: string[] = [
    'Producto',
    'Servicio'
  ];
  private currentConfiguracion: any;
  private notificationQueue: { text: string; action?: string }[] = [];
  private isNotificationDisplayed = false;
  private snackBarRef: MatSnackBarRef<any> | null = null;

  constructor(
    private injector: Injector,
    private ng2ImgMax: Ng2ImgMaxService,
    private snackBar: MatSnackBar
  ) { }

  public message(text: string, action: string = 'Cerrar') {
    this.currentConfiguracion = this.injector.get(DataService).getCurrentConfiguracion();
    if (this.currentConfiguracion.notificacionesEnabled !== undefined)
      if (this.currentConfiguracion.notificacionesEnabled === '1') {
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

  public copy(textToCopy: any) {
    this.currentConfiguracion = this.injector.get(DataService).getCurrentConfiguracion();
    if (this.currentConfiguracion.copyEnabled !== undefined)
      if (this.currentConfiguracion.copyEnabled === '1') {
        const el = document.createElement('textarea');
        el.value = String(textToCopy);
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
          this.message('Texto copiado !');
        } finally {
          document.body.removeChild(el);
        }
      }
  }

  public encodeBase64(text: string): string {
    return btoa(text);
  }

  public encodeImgToBase64(file: File): Observable<string> {
    return from(this.ng2ImgMax.compressImage(file, 0.03))
      .pipe(
        switchMap(result => {
          const reader = new FileReader();
          reader.readAsDataURL(result);
          return from(new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject('Error al leer la imagen');
            };
          }));
        }),
        catchError(error => {
          console.error('Error al comprimir la imagen:', error);
          return '' + error;
        })
      );
  }

  public decodeBase64(base64String: string): string {
    return atob(base64String);
  }

  public getDateNow(): Date {
    const options = { timeZone: 'America/Argentina/Buenos_Aires' };
    const fecha = new Date().toLocaleString('en-US', options);
    return new Date(fecha);
  }

  public stringToDate(date: string): Date {
    return new Date(date);
  }

  public isFAuthExpired(expirationTime: string): boolean {
    if (expirationTime) {
      const fechaActual: Date = this.getDateNow();
      const fechaVencimiento: Date = this.stringToDate(expirationTime);
      if (fechaActual > fechaVencimiento) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  public needNewFAuth(expirationTime: string): boolean {
    if (expirationTime) {
      const fechaActual: Date = this.getDateNow().addHours(1);
      const fechaVencimiento: Date = this.stringToDate(expirationTime);
      if (fechaActual > fechaVencimiento) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  public rellenoCampos_IE(type: string): any {
    const Item: any = {};
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const dd = String(today.getDate()).padStart(2, '0');
    Item.date = `${yyyy}-${mm}-${dd}`;
    if (this.currencys.length > 0)
      Item.currency = this.currencys[0];
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








}


