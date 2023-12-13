import { Component, OnInit } from '@angular/core';
import { User } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';
import { Router } from '@angular/router';
import { SharedService } from '@services/shared/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public nombreCompleto: string = "";
  public telefono: string = "";

  public correo: string = "";
  public confirmarCorreo: string = "";

  public clave: string = "";
  public confirmarClave: string = "";

  public errorMsg: string = '';
  public loading: boolean = false;

  constructor(
    public dataService: DataService,
    public sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.Usuarios$
      .subscribe({
        next: (data) => {
          this.loading = false;
          if (data[0])
            if (data[0].Estado)
              if (data[0].Estado === 'generado')
                this.router.navigate(['/login']);

          if (data[0])
            if (data[0].Estado)
              if (data[0].Estado === 'error')
                this.errorMsg = data[0].message;
        }
      });
  }

  public Registro() {
    if (this.correo !== this.confirmarCorreo) {
      this.errorMsg = 'Ingreso mal el correo.';
      return;
    } else if (!this.sharedService.isValidEmail(this.correo)) {
      this.errorMsg = 'Ingreso un correo invalido.';
      return;
    } else if (this.clave !== this.confirmarClave) {
      this.errorMsg = 'Ingreso mal la contraseña.';
      return;
    } else if (this.clave.length < 8) {
      this.errorMsg = 'Debe ingresar una contraseña igual o mayor a 8 caracteres.';
      return;
    }

    this.errorMsg = '';
    this.loading = true;

    const body: User = {
      administrador: '1',
      isNewAdmin: '1',
      username: this.sharedService.onlyUser(this.correo).trim(),
      fullname: this.nombreCompleto.trim(),
      phone: this.telefono.trim(),
      email: this.correo.trim(),
      password: this.clave
    };
    this.dataService.fetchUsuarios('POST', body);
  }
}
