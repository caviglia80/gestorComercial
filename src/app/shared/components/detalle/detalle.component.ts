import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  selectedItem: any;



  ngOnInit() {
/*     this.sharedService.selectedElement$.subscribe((element: any) => {
      this.selectedItem = element;
    }); */
  }

/*   getKeys(obj: any): string[] {
    return Object.keys(obj);
  } */
}
