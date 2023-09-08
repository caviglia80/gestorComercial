import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dataRow: any = new BehaviorSubject<any>(null);

  public getVariableCompartida() {
    return this.dataRow.asObservable();
  }

  public actualizarVariable(valor: any) {
    this.dataRow.next(valor);
  }
}
