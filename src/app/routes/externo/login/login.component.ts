import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '@services/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loading: boolean = false;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  ngOnInit(): void {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      this.loginForm.patchValue({
        email: storedEmail,
        remember: true
      });
    }
  }

  async onCheckboxChange(event: any) {
    this.loginForm.get('remember')?.setValue(event.checked);
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password, remember } = this.loginForm.value;
      this.tokenService.login(email, password, remember).subscribe({
        next: (response) => {
          this.processResponse(response);
        },
        error: (error) => {
          this.loading = false;
          console.error(error);
        }
      });
    }
  }

  private processResponse(response: any) {
    this.loading = false;
    if (response && response.lenght !== 0) {
      this.errorMessage = '';
      if (response.rolValido == false)
        this.errorMessage = 'Usuario con rol eliminado, ingrese con un usuario valido y asigne un nuevo rol.';
      else if (response.error)
        this.errorMessage = 'Credenciales inválidas.';
    }
  }
}
