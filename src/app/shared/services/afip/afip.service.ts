import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { AfipRequest } from '@models/afipRequest/afip-request';


@Injectable({
  providedIn: 'root',
})
export class AfipService {
  /*   private host = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?op='; */
  private host = 'https://francisco-caviglia.com.ar/francisco-caviglia/php/AFIP/afip.php';

  /*   private ds_AFIP: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    public Afip$: Observable<any> = this.ds_AFIP.asObservable();
   */
  constructor(
    /*     private sharedService: SharedService, */
    private http: HttpClient) { }

  public sendRequestAfip(body: string) {
    const header = new HttpHeaders({ 'Content-Type': 'text/xml;charset=UTF-8' });
    return this.http.post(this.host, body, { headers: header, responseType: 'text' });
  }











































  /*  public enviarXml_2(xmlData: string, parameter: string): void {
     if (!SharedService.isProduction) console.log(xmlData);
     const url = this.host + parameter;
     const headers = new HttpHeaders({ 'Content-Type': 'text/xml;charset=UTF-8' });
     const options = { headers: headers };



     this.http.post<any>(url, xmlData, options)
       .subscribe({
         next: (data) => {
           this.ds_AFIP.next(data);
         },
         error: (error) => {
           if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
           this.sharedService.message('Error: AFIP');
         }
       });
   } */



















  /*   checkSystemStatus(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        createClient(this.wsdlUrl, (err, client) => {
          if (err) {
            reject(err);
            return;
          }
          const request = {};
          client['FEDummy'](request, (err: any, result: any) => {
            if (err) {
              reject(err);
              return;
            }
            const dummyResponse = result['FEDummyResult'];
            if (
              dummyResponse.AppServer === 'OK' &&
              dummyResponse.DbServer === 'OK' &&
              dummyResponse.AuthServer === 'OK'
            ) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
      });
    } */
}
