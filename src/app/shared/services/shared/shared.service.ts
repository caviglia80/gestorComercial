import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public static isProduction = environment.production;
  public static host: string = 'https://francisco-caviglia.com.ar/francisco-caviglia/php/'; /* localhost/ */
  public static proxy: string = 'https://cors-anywhere.herokuapp.com/';
  public currencys: string[] = ['ARS', 'USD', 'EUR'];
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
    'Bitcoin'
  ];

  constructor(
    private snackBar: MatSnackBar
  ) { }

  public copy(textToCopy: string) {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      this.message('Texto copiado !');
    } finally {
      document.body.removeChild(el);
    }
  }

  public message(text: string, action: string = 'Cerrar') {
    this.snackBar.open(text, action, {
      duration: 2500,
    });
  }

  public encodeBase64(text: string): string {
    return btoa(text);
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



}


