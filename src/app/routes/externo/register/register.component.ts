import { Component, OnInit } from '@angular/core';
import { empresa, User } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public nombreCompleto: string = "nombreCompleto";
  public correo: string = "correo@123.com";
  public telefono: string = "telefono";
  public usuario: string = "asd2";
  public clave: string = "asd";
  public confirmarClave: string = "confirmarClave";
  //  private empresaId: string = ''; // son dos pasadas por NewEmpresa$, 1-data.empresaId, 2-data.usuarioId

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  public Registro() {





    const body: User = {
      isNewAdmin: '1',
      username: this.usuario,
      fullname: this.nombreCompleto,
      position: 'Administrador',
      phone: this.telefono,
      email: this.correo,
      password: this.clave
    };
    this.dataService.fetchUsuarios('POST', body);






    // this.dataService.fetchEmpresa('POST', new empresa()); // creo la mempresa
  }

  private dataInit() {

  }





}
