import { Component, Input } from '@angular/core';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  @Input() public title: string = '';

  constructor(
    private sharedService: SharedService
  ) { }

  public cambiarValor() {
    this.sharedService.setDataRow(null);
  }
}

