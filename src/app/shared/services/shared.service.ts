import { Injectable } from '@angular/core';
/* import { BehaviorSubject } from 'rxjs'; */
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  /*   private dataRow: any = new BehaviorSubject<any>(null); */


  constructor(
    private snackBar: MatSnackBar
  ) { }

  /*   public getDataRow() {
      return this.dataRow.asObservable();
    }

    public setDataRow(valor: any) {
      this.dataRow.next(valor);
    } */




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
}
