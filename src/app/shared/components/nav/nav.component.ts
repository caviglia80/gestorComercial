import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  public sidenavOpened: boolean = true;
  panelOpenState = false;

  public toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}




