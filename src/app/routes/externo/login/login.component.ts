import { Component, OnInit } from '@angular/core';
import { TokenService } from '@services/token/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string = '';
  public password: string = '';
  public loginError: boolean = false;
  public remember: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem("username") || "";
    this.remember = localStorage.getItem("username") !== null;
  }

  onCheckboxChange(event: any) {
    this.remember = event.target.checked;
  }

  onLogin() {
    this.tokenService.login(this.username, this.password, this.remember).subscribe(
      response => {
        this.loginError = false;
      },
      error => {
        console.error(error);
        this.loginError = true;
      }
    );
  }
}
