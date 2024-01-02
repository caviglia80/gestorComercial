import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '@models/mainClasses/main-classes';
import { DataService } from '@services/data/data.service';
import { Router } from '@angular/router';
import { SharedService } from '@services/shared/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public errorMsg: string = '';
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dataService: DataService,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],
      confirmarCorreo: ['', Validators.required],
      clave: ['', Validators.required],
      confirmarClave: ['', Validators.required],
    });
  }

  public async Registro() {
    this.errorMsg = '';

    const { nombreCompleto, telefono, correo, confirmarCorreo, clave, confirmarClave } = this.registerForm.value;

    if (correo !== confirmarCorreo) {
      this.errorMsg = 'Ingreso mal el correo.';
      return;
    } else if (!this.sharedService.isValidEmail(correo)) {
      this.errorMsg = 'Ingreso un correo invalido.';
      return;
    } else if (clave !== confirmarClave) {
      this.errorMsg = 'Ingreso mal la contraseña.';
      return;
    } else if (clave.length < 8) {
      this.errorMsg = 'Debe ingresar una contraseña igual o mayor a 8 caracteres.';
      return;
    }

    this.loading = true;

    try {
      const usuarioNuevo: Usuario = {
        username: this.sharedService.onlyUser(correo).trim(),
        fullname: nombreCompleto.trim(),
        phone: telefono.trim(),
        email: correo.trim(),
        password: clave
      };

      const response = await this.dataService.fetchNewAdmin('POST', usuarioNuevo);
      if (response.message === 'Registros generados')
        this.router.navigate(['/login']);
      else
        this.errorMsg = response.message;
    } finally {
      this.loading = false;
    }
  }
}
