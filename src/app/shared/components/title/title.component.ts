import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input() public title: string = '';
  public selectedItem: { key: string; value: any }[] | null = null;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.getDataRow().subscribe((valor: any) => { this.selectedItem = valor; });
  }

  public cambiarValor() {
    this.sharedService.setDataRow(null);
  }
}

