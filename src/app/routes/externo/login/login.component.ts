import { Component, OnInit } from '@angular/core';
import { LoginService } from '@services/login/login.service';

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

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem("username") || "";
    this.remember = localStorage.getItem("username") !== null;
  }

  onCheckboxChange(event: any) {
    console.log(event.target.checked);
    this.remember = event.target.checked;
  }


  onLogin() {
    this.loginService.login(this.username, this.password, this.remember).subscribe(
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
