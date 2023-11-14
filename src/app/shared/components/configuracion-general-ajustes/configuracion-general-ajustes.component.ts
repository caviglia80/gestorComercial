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
  public dataConfig: empresa = new empresa();
  public Color1 = '#000000';
  public Color2 = '#000000';
  public colorPickerIsOpen = false;
  public copyEnabled = false;
  public titulo = '';

  constructor(
    public dataService: DataService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      this.dataConfig = data[0];
      if (this.dataConfig !== undefined) {
        this.copyEnabled = this.dataConfig.copyEnabled === '1';
        this.Color1 = this.dataConfig.color1;
        this.Color2 = this.dataConfig.color2;
        this.titulo = this.dataConfig.titulo;
      }
    });
    this.dataService.fetchEmpresa('GET');
  }

  private clearFileInput() {
    if (this.fileInput && this.fileInput.nativeElement)
      this.fileInput.nativeElement.value = '';
  }

  public onFileSelected(event: any, fileType: string) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.split('.').pop() !== fileType) {
        this.errorMessageImg = true;
        this.clearFileInput();
      } else {
        this.errorMessageImg = false;
        this.sharedService.encodeImgToBase64(selectedFile).subscribe((Base64) => {
          this.dataService.fetchEmpresa('PUT', { id: 1, icono: Base64 });
        });
      }
    }
  }

  public restauracionDeFabrica() {
    this.dataService.fetchEmpresa('PUT', new empresa());
  }

  public habilitarCopy(isChecked: boolean) {
    this.dataService.fetchEmpresa('PUT', { id: 1, copyEnabled: isChecked ? "1" : "0" });
  }

  public color1(color: string) {
    if (color !== this.dataConfig.color1)
      this.dataService.fetchEmpresa('PUT', { id: 1, color1: color });
  }

  public color2(color: string) {
    if (color !== this.dataConfig.color2)
      this.dataService.fetchEmpresa('PUT', { id: 1, color2: color });
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

  public setTitulo(titulo: string) {
    if (titulo !== this.dataConfig.titulo)
      this.dataService.fetchEmpresa('PUT', { id: 1, titulo: titulo });
  }
}
