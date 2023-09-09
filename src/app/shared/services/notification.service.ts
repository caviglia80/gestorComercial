import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  show(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }
}
