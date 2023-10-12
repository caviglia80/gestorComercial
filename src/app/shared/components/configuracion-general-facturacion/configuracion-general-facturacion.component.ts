import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { facturacionAuth } from '@models/mainClasses/main-classes';
import { AfipService } from '@services/afip/afip.service';
import { AfipRequest } from '@models/afipRequest/afip-request';

@Component({
  selector: 'app-configuracion-general-facturacion',
  templateUrl: './configuracion-general-facturacion.component.html',
  styleUrls: ['./configuracion-general-facturacion.component.css']
})
export class ConfiguracionGeneralFacturacionComponent implements AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  public errorMessageCrt: boolean = false;
  public errorMessageKey: boolean = false;
  public fAuthStore = new facturacionAuth;
  public online: boolean = false;
  public loading: boolean = true;
  public error: boolean = false;
  public isConfigurated: boolean = false;
  public systemStatus: boolean = false;

  constructor(
    public dataService: DataService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private afipService: AfipService
  ) { }

  ngAfterViewInit() {
    /* this.facturacionAuthInit(); */
    this.cdr.detectChanges();
  }

  private facturacionAuthInit() {
    this.dataService.FacturacionAuth$.subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.fAuthStore = data[0];
          this.consultarEstados();
        }
        this.loading = false;
        this.error = false;
      },
      error: () => {
        this.consultarEstados();
        this.loading = false;
        this.error = true;
      }
    });
    this.dataService.fetchFacturacionAuth('GET');
  }

  private clearFileInput() {
    if (this.fileInput && this.fileInput.nativeElement)
      this.fileInput.nativeElement.value = '';
  }

  public onFileSelected(event: any, fileType: string) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.split('.').pop() !== fileType) {
        if (fileType === 'crt') this.errorMessageCrt = true; else
          this.errorMessageKey = true;
        this.clearFileInput();
      } else {
        this.errorMessageCrt = false;
        this.errorMessageKey = false;

        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
          const fileContent = e.target.result;
          const base644: string = this.sharedService.encodeBase64(fileContent);
          this.sendBase64(base644, fileType);
        };
        fileReader.readAsText(selectedFile);
      }
    }
  }

  private sendBase64(base644: string, fileType: string, id: number = 1) {
    if (fileType === 'crt')
      this.dataService.fetchFacturacionAuth('PUT', { id: 1, certificado: base644 });
    else if (fileType === 'key')
      this.dataService.fetchFacturacionAuth('PUT', { id: 1, llave: base644 });
    setTimeout(() => {
      this.iniciarSesion();
    }, 4000);
  }

  private IsConfigurated(): void {
    this.isConfigurated = false;
    if (this.fAuthStore.certificado)
      if (this.fAuthStore.llave)
        if (this.fAuthStore.certificado.length >= 10)
          if (this.fAuthStore.llave.length >= 10)
            this.isConfigurated = true;
  }

  private IsOnline(): void {
    this.online = false;
    if (this.isConfigurated)
      if (this.fAuthStore)
        if (this.fAuthStore.expirationTime)
          if (this.fAuthStore.sign)
            if (this.fAuthStore.expirationTime.length >= 5)
              if (this.fAuthStore.sign.length >= 5)
                this.online = !this.sharedService.isFAuthExpired(this.fAuthStore.expirationTime!) && this.fAuthStore.sign!.length >= 5 && this.fAuthStore.token!.length >= 5;
  }

  public iniciarSesion() {
    this.loading = true;
    this.dataService.fetchFacturacionAuth('GET');

    if (this.isConfigurated) {
      this.afipService.fetchWSAA('POST', { id: 1, CERT: this.fAuthStore.certificado, PRIVATEKEY: this.fAuthStore.llave });
    } else {
      this.sharedService.message('Cargue certificado, llave y CUIT.');
      return;
    }
  }

  public forzarToken() {
    this.loading = true;
    this.dataService.fetchFacturacionAuth('GET');
    if (this.fAuthStore.certificado && this.fAuthStore.llave)
      if (this.fAuthStore.certificado.length > 10 && this.fAuthStore.llave.length > 10) {
        this.afipService.fetchWSAA('POST', { id: 1, CERT: this.fAuthStore.certificado, PRIVATEKEY: this.fAuthStore.llave });
      } else {
        this.sharedService.message('Error, asegurese de haber cargado el certificado y la llave.');
        return;
      }
  }

  public consultarEstados() {
    this.IsConfigurated();
    this.checkSystemStatus();
    this.IsOnline();
  }

  public checkSystemStatus() {
    this.afipService.send_AfipRequest(new AfipRequest().FEDummy()).subscribe({
      next: (dataResponse) => {

        if (dataResponse.length >= 10) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(dataResponse, 'text/xml');
          const appServerStatus = xmlDoc.querySelector('AppServer')!.textContent;
          const dbServerStatus = xmlDoc.querySelector('DbServer')!.textContent;
          const authServerStatus = xmlDoc.querySelector('AuthServer')!.textContent;

          if (appServerStatus === 'OK' && dbServerStatus === 'OK' && authServerStatus === 'OK') this.systemStatus = true; else
            this.systemStatus = false;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  public GetPuntosDeVenta() {
    let body = new AfipRequest().FEParamGetPtosVenta();
    const xmlRequest = new DOMParser().parseFromString(body, 'text/xml');
    xmlRequest.querySelector('Token')!.textContent = this.sharedService.decodeBase64(this.fAuthStore.token!);
    xmlRequest.querySelector('Sign')!.textContent = this.sharedService.decodeBase64(this.fAuthStore.sign!);
    xmlRequest.querySelector('Cuit')!.textContent = this.fAuthStore.cuit;

    this.afipService.send_AfipRequest(new XMLSerializer().serializeToString(xmlRequest)).subscribe({
      next: (dataResponse) => {
        /* if (dataResponse.length >= 5)
          this.testStr = dataResponse; */
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  public FECAESolicitar_C() {
    let body = new AfipRequest().FECAESolicitar('c');
    const xmlRequest = new DOMParser().parseFromString(body, 'text/xml');

    xmlRequest.querySelector('Token')!.textContent = this.sharedService.decodeBase64(this.fAuthStore.token!);
    xmlRequest.querySelector('Sign')!.textContent = this.sharedService.decodeBase64(this.fAuthStore.sign!);
    xmlRequest.querySelector('Cuit')!.textContent = this.fAuthStore.cuit;
    xmlRequest.querySelector('PtoVta')!.textContent = '1';

    xmlRequest.querySelector('CbteFch')!.textContent = '20230929';
    xmlRequest.querySelector('DocTipo')!.textContent = '80';
    xmlRequest.querySelector('DocNro')!.textContent = '30000000007';

    xmlRequest.querySelector('CbteDesde')!.textContent = '6';
    xmlRequest.querySelector('CbteHasta')!.textContent = '6';

    xmlRequest.querySelector('ImpTotal')!.textContent = '5';
    xmlRequest.querySelector('ImpNeto')!.textContent = '5';

    this.afipService.send_AfipRequest(new XMLSerializer().serializeToString(xmlRequest)).subscribe({
      next: (dataResponse) => {
        /*   if (dataResponse.length >= 5)
            this.testStr = dataResponse; */
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }




















}
