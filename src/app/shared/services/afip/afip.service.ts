import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SharedService } from '@services/shared/shared.service';
import { AfipRequest } from '@models/afipRequest/afip-request';
import * as vkbeautify from 'vkbeautify';
import { map } from 'rxjs/operators';
import { DataService } from '@services/data/data.service';

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
    public dataService: DataService,
    private sharedService: SharedService,
    private http: HttpClient) { }


  public send_AfipRequest(body: string) {
    const header = new HttpHeaders({ 'Content-Type': 'text/xml;charset=UTF-8' });
    return this.http.post(this.host, body, { headers: header, responseType: 'text' }).pipe(
      map((response: string) => {
        return vkbeautify.xml(response);
      })
    );
  }

  public fetchWSAA(method = '', body: any = {}, proxy = false): void {
    if (!SharedService.isProduction) console.log(body);
    body = JSON.stringify(body);
    const headers: {} = { 'Content-Type': 'application/json' }
    let url = SharedService.host + 'AFIP/wsaa.php';
    if (proxy) url = SharedService.proxy + url;

    if (method === 'POST') {
      this.http.post<any[]>(url, body, headers)
        .subscribe({
          next: (data) => {

            if (data) {
              const WsaaStore: any = data;

              if (typeof WsaaStore === 'object' && Object.keys(WsaaStore).length === 0) {
                this.sharedService.message('Es posible que ya haya iniciado sesión.');
              } else {
                if (WsaaStore.header.uniqueId !== undefined &&
                  WsaaStore.header.expirationTime !== undefined &&
                  WsaaStore.credentials.token !== undefined &&
                  WsaaStore.credentials.sign !== undefined &&
                  WsaaStore.header.destination !== undefined)
                  if (WsaaStore.header.uniqueId.length > 5 &&
                    WsaaStore.header.expirationTime.length > 5 &&
                    WsaaStore.credentials.token.length > 5 &&
                    WsaaStore.credentials.sign.length > 5 &&
                    WsaaStore.header.destination.length > 5)
                    this.dataService.fetchFacturacionAuth('PUT', {
                      id: 1,
                      cuit: WsaaStore.header.destination.match(/CUIT (\d+)/)[1],
                      uniqueId: WsaaStore.header.uniqueId,
                      expirationTime: WsaaStore.header.expirationTime,
                      token: this.sharedService.encodeBase64(WsaaStore.credentials.token),
                      sign: this.sharedService.encodeBase64(WsaaStore.credentials.sign)
                    });
                  else
                    this.sharedService.message('Error, no se pudieron guardar las credenciales.');
                else
                  this.sharedService.message('Error, no se pudieron guardar las credenciales.');
              }
            }
          },
          error: (error) => {
            if (!SharedService.isProduction) console.error(JSON.stringify(error, null, 2));
            this.sharedService.message('Error al intentar generar nuevo token.');
          }
        });
    }
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
