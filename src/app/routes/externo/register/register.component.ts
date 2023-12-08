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
  public correo: string = "";
  public telefono: string = "";
  public usuario: string = "";
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

  public Registro() {
    this.errorMsg = '';
    this.loading = true;

    const body: User = {
      isNewAdmin: '1',
      username: this.usuario,
      fullname: this.nombreCompleto,
      phone: this.telefono,
      email: this.correo,
      password: this.clave
    };
    this.dataService.fetchUsuarios('POST', body);
  }
}
