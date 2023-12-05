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
  public loginError: boolean = false;
  public remember: boolean = false;

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
      next: () => {
        this.loginError = false;
      },
      error: (error) => {
        console.error(error);
        this.loginError = true;
        this.loading = false;
      }
    });
  }
}
