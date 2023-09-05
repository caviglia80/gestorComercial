import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gestorComercial';
}

export class GobalVars {
  public static host: string = 'https://francisco-caviglia.com.ar/francisco-caviglia/'; /* localhost/ */
  public static proxyUrl: string = 'https://cors-anywhere.herokuapp.com/'; // Use the CORS Anywhere proxy
}



