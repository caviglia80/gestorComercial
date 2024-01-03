import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public errorMsj: string = '';

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.errorMsj = await this.authService.getPeriodoVencido() ? 'Contacte con su administrador.' : '';
  }
}
