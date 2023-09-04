import { Component } from '@angular/core';
/* import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gestorComercial';
  /* private host: string = 'https://francisco-caviglia.com.ar/'; */ /* host Prod: localhost */

  /*   constructor(private http: HttpClient) { }

    checkDatabaseConnection() {
      this.http.get(this.host + 'francisco-caviglia/db_connection.php')
        .pipe(
          catchError(error => {
            console.error(error);
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            console.log(response);
          }
        });
    } */
}

export class GobalVars {
  public static host: string = 'https://francisco-caviglia.com.ar/francisco-caviglia/';
}



