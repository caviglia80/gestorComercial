import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { facturacionAuth } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general',
  templateUrl: './configuracion-general.component.html',
  styleUrls: ['./configuracion-general.component.css']
})
export class ConfiguracionGeneralComponent implements AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  public errorMessageCrt: boolean = false;
  public errorMessageKey: boolean = false;
  public fAuthStore = new facturacionAuth;
  public WsaaStore: any;
  public online: boolean = false;
  public loading: boolean = true;
  public error: boolean = false;
  public isConfigurated: boolean = false;

  constructor(
    public dataService: DataService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.facturacionAuthInit();
    this.cdr.detectChanges();
  }

  private facturacionAuthInit() {
    this.dataService.FacturacionAuth$.subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.fAuthStore = data[0];
          this.online = !this.sharedService.isFAuthExpired(this.fAuthStore.expirationTime!) && this.fAuthStore.sign!.length >= 5 && this.fAuthStore.token!.length >= 5;
          this.IsConfigurated();
        }
        this.loading = false;
        this.error = false;
      },
      error: () => {
        this.online = false;
        this.loading = false;
        this.error = true;
      }
    });
    this.dataService.fetchFacturacionAuth('GET');

    this.dataService.Wsaa$.subscribe({
      next: (data) => {
        if (data && data?.length === undefined) {
          this.WsaaStore = data;

          if (this.WsaaStore.header.uniqueId !== undefined &&
            this.WsaaStore.header.expirationTime !== undefined &&
            this.WsaaStore.credentials.token !== undefined &&
            this.WsaaStore.credentials.sign !== undefined)
            if (this.WsaaStore.header.uniqueId.length > 5 &&
              this.WsaaStore.header.expirationTime.length > 5 &&
              this.WsaaStore.credentials.token.length > 5 &&
              this.WsaaStore.credentials.sign.length > 5)
              this.dataService.fetchFacturacionAuth('PUT', {
                id: 1,
                uniqueId: this.WsaaStore.header.uniqueId,
                expirationTime: this.WsaaStore.header.expirationTime,
                token: this.sharedService.encodeBase64(this.WsaaStore.credentials.token),
                sign: this.sharedService.encodeBase64(this.WsaaStore.credentials.sign)
              });
            else
              this.sharedService.message('Error, no se pudieron guardar las credenciales.');
          else
            this.sharedService.message('Error, no se pudieron guardar las credenciales.');
        }
        this.loading = false;
        this.error = false;
      },
      error: (error) => {
        this.online = false;
        this.loading = false;
        this.error = true;

        console.error(error);
      }
    });
  }

  private clearFileInput() {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
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
        if (this.fAuthStore.certificado.length >= 15)
          if (this.fAuthStore.llave.length >= 15)
            this.isConfigurated = true;
  }

  public iniciarSesion() {
    this.loading = true;
    this.dataService.fetchFacturacionAuth('GET');

    if (this.isConfigurated) {
      this.dataService.fetchWSAA('POST', { id: 1, CERT: this.fAuthStore.certificado, PRIVATEKEY: this.fAuthStore.llave });
    } else {
      this.sharedService.message('Error, asegurese de haber cargado el certificado y la llave.');
      return;
    }
  }

  public forzarToken() {
    this.loading = true;
    this.dataService.fetchFacturacionAuth('GET');
    if (this.fAuthStore.certificado && this.fAuthStore.llave)
      if (this.fAuthStore.certificado.length > 15 && this.fAuthStore.llave.length > 15) {
        this.dataService.fetchWSAA('POST', { id: 1, CERT: this.fAuthStore.certificado, PRIVATEKEY: this.fAuthStore.llave });
      } else {
        this.sharedService.message('Error, asegurese de haber cargado el certificado y la llave.');
        return;
      }
  }














}








