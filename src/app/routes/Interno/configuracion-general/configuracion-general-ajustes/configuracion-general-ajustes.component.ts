import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-ajustes',
  templateUrl: './configuracion-general-ajustes.component.html',
  styleUrls: ['./configuracion-general-ajustes.component.css']
})
export class EmpresaConfiguracionAjustesComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  public errorMessageImg = false;
  public dataEmpresa: empresa = new empresa();
  public Color1 = '#000000';
  public Color2 = '#000000';
  public colorPickerIsOpen = false;
  public nombre = '';

  constructor(
    public dataService: DataService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data[0] && data[0].lenght !== 0) {
        this.dataEmpresa = data[0];
        this.Color1 = this.dataEmpresa.color1 || this.Color1;
        this.Color2 = this.dataEmpresa.color2 || this.Color2;
        this.nombre = this.dataEmpresa.nombre || '';
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  private clearFileInput() {
    if (this.fileInput && this.fileInput.nativeElement)
      this.fileInput.nativeElement.value = '';
  }

  // public onFileSelected(event: any, fileType: string) {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     if (selectedFile.name.split('.').pop() !== fileType) {
  //       this.errorMessageImg = true;
  //       this.clearFileInput();
  //     } else {
  //       this.errorMessageImg = false;
  //       this.sharedService.encodeImgToBase64(selectedFile).subscribe((Base64) => {
  //
  //
  //         console.log(Base64);
  //
  //         this.dataService.fetchEmpresa('PUT', { icono: Base64 });
  //       });
  //     }
  //   }
  // }

  // En tu componente Angular
  public onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'image/png') {
      this.errorMessageImg = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result as string;

      //  console.log(base64);

        this.dataService.fetchEmpresa('PUT', { icono: base64 });
      };
      reader.readAsDataURL(selectedFile);
    } else {
      this.errorMessageImg = true;
      this.clearFileInput();
    }
  }

  public restauracionDeFabrica() {
    this.dataService.fetchEmpresa('PUT', new empresa());
  }

  public color1(color: string) {
    if (color !== this.dataEmpresa.color1)
      this.dataService.fetchEmpresa('PUT', { color1: color });
  }

  public color2(color: string) {
    if (color !== this.dataEmpresa.color2)
      this.dataService.fetchEmpresa('PUT', { color2: color });
  }

  public ColorPickerIsOpen(open: boolean) {
    this.colorPickerIsOpen = open;
  }

  public previewColor1(color: string) {
    document.documentElement.style.setProperty('--color-1', color);
  }

  public previewColor2(color: string) {
    document.documentElement.style.setProperty('--color-2', color);
  }

  public setNombre(nombre: string) {
    if (nombre !== this.dataEmpresa.nombre)
      this.dataService.fetchEmpresa('PUT', { nombre: nombre });
  }
}
