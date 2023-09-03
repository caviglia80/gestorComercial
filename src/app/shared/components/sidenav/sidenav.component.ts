import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
 /*  @ViewChild('sidenav') sidenav!: MatSidenav; */

  public sidenavOpened: boolean = true;

  public toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;

  }






/*   hoverActive: boolean = true;


  setHoverState(state: boolean): void {
    this.hoverActive = state;
  } */
}
