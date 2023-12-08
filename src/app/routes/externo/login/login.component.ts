import { Component, OnInit } from '@angular/core';
import { TokenService } from '@services/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loading: boolean = false;
  public email: string = '';
  public password: string = '';
  public remember: boolean = false;
  public errorMessage: string = '';

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.email = localStorage.getItem("email") || "";
    this.remember = localStorage.getItem("email") !== null;
  }

  onCheckboxChange(event: any) {
    this.remember = event.target.checked;
  }

  onLogin() {
    this.loading = true;
    this.tokenService.login(this.email, this.password, this.remember).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.loading = false;
        if (response.rolValido === false)
          this.errorMessage = 'Usuario con rol eliminado, ingrese con un usuario valido y asigne un nuevo rol.';
        else if (response.error)
          this.errorMessage = 'Credenciales inválidas.';
      },
      error: (error) => {
        this.loading = false;
        console.error(error);
      }
    });
  }
}
