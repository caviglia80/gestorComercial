import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public errorMsj: boolean = false;


  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.adminAvailableMenus().then((hayMenus) => {
      this.errorMsj = !hayMenus;
    });
  }






}
