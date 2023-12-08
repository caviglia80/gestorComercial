import { Component, OnInit } from '@angular/core';
import { User } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';
import { Router } from '@angular/router';

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

  isValidEmail(correo: string): boolean {
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regexCorreo.test(correo);
  }

  onlyUser(correo: string): string {
    return correo.split('@')[0];
  }

  public Registro() {

    if (this.correo !== this.confirmarCorreo) {
      this.errorMsg = 'Ingreso mal el correo.';
      return;
    } else if (!this.isValidEmail(this.correo)) {
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
      isNewAdmin: '1',
      username: this.onlyUser(this.correo).trim(),
      fullname: this.nombreCompleto.trim(),
      phone: this.telefono.trim(),
      email: this.correo.trim(),
      password: this.clave
    };
    this.dataService.fetchUsuarios('POST', body);
  }
}
