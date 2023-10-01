import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
/* import * as sharp from 'sharp'; */

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
    'Bitcoin',
    'Otro'
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
/*
  public async optimizarImagen(file: File, ancho: number = 300, alto: number = 200, calidad: number = 80): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const iconoOriginalBuffer: ArrayBuffer = event.target!.result as ArrayBuffer;
          const buffer: Buffer = Buffer.from(iconoOriginalBuffer);

          let imagenProcesada = sharp(buffer);
          imagenProcesada = imagenProcesada.toFormat('png' as keyof sharp.FormatEnum);

          // Redimensionar
          if (ancho && alto)
            imagenProcesada = imagenProcesada.resize(ancho, alto);

          // Aplicar compresión
          if (calidad)
            imagenProcesada = imagenProcesada.png({ quality: calidad });

          const imagenProcesadaBuffer = await imagenProcesada.toBuffer();
          resolve(imagenProcesadaBuffer);
        };

        reader.onerror = (error) => {
          reject(new Error('Error al cargar el archivo: ' + error));
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(new Error('Error al procesar la imagen: ' + error));
      }
    });
  }
 */





}


