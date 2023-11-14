import { Component } from '@angular/core';
import { Injectable } from '@angular/core';

declare global {
  interface Date {
    addHours(hours: number): Date;
  }
}

Date.prototype.addHours = function (hours: number): Date {
  const date = new Date(this.valueOf());
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
  private dataSource: any;

  constructor(
  ) { }
}

@Injectable()
export class GlobalVariables {
  public static wspNumer: string = '+5492364336228';
  public static wspTxt: string = '';
}
