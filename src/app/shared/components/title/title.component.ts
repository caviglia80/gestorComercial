import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  @Input() public title: string = '';
  @Input() hijo: any;

  public cambiarValor() {
    console.log(this.hijo);
    this.hijo = null;
    console.log(this.hijo);
  }
}
