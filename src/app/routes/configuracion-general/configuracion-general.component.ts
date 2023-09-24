import { Component, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { facturacionAuth } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general',
  templateUrl: './configuracion-general.component.html',
  styleUrls: ['./configuracion-general.component.css']
})
export class ConfiguracionGeneralComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  public errorMessageCrt: boolean = false;
  public errorMessageKey: boolean = false;
  public fAuthStore = new facturacionAuth;
  public online: boolean = false;
  public loading: boolean = true;
  public error: boolean = false;

  constructor(
    public dataService: DataService,
    private sharedService: SharedService
  ) {
    this.facturacionAuthInit();
  }

  private facturacionAuthInit() {
    this.dataService.FacturacionAuth$.subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.fAuthStore = data[0];
          this.online = !this.sharedService.isFAuthExpired(this.fAuthStore.expirationTime!);
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
      this.consultarToken();
    }, 4000);
  }

  public consultarToken() {
    this.loading = true;
    this.dataService.fetchFacturacionAuth('GET');
  }

  public IsConfigurated(): boolean {
    if (this.fAuthStore.certificado)
      if (this.fAuthStore.llave)
        if (this.fAuthStore.certificado.length !== 0)
          if (this.fAuthStore.llave.length !== 0)
            return true;
    return false;
  }

  public forzarToken() {
    /*     this.loading = true;





        this.dataService.fetchFacturacionAuth('PUT', { id: 1, expirationTime: new Date() });
        this.dataService.fetchFacturacionAuth('GET'); */



    if (this.fAuthStore.certificado && this.fAuthStore.llave) {

/*       this.fAuthStore.certificado
      this.fAuthStore.llave */




    } else {
      alert('Error, asegurese de haber cargado el certificado y la llave.');
      return;
    }








  }














}








