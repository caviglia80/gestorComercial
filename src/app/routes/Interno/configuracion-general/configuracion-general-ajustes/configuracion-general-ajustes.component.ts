import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataService } from '@services/data/data.service';
import { empresa } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-configuracion-general-ajustes',
  templateUrl: './configuracion-general-ajustes.component.html',
  styleUrls: ['./configuracion-general-ajustes.component.css']
})
export class EmpresaConfiguracionAjustesComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  public errorMessageImg: string = '';
  public dataEmpresa: empresa = new empresa();
  public Color1 = '#000000';
  public Color2 = '#000000';
  public colorPickerIsOpen = false;
  public nombre = '';

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Empresa$.subscribe((data) => {
      if (data) {
        this.dataEmpresa = data;
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

  // En tu componente Angular
  public async onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const maxFileSize = 501 * 1024; // 500 KB en bytes

    if (selectedFile) {
      if (selectedFile.type === 'image/png') {
        if (selectedFile.size <= maxFileSize) {
          this.errorMessageImg = '';

          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: any) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(selectedFile);
          });

          try {
            await this.dataService.fetchEmpresa('PUT', { icono: base64 });
            window.location.reload();
          } catch (error) {
            console.error("Hubo un error al actualizar el icono:", error);
            this.errorMessageImg = 'Hubo un error al actualizar el icono';
          }

        } else {
          this.errorMessageImg = 'La imagen debe tener un peso menor o igual a 500kb';
        }
      } else {
        this.errorMessageImg = 'Solo se permiten imagenes con extensión .png';
      }
    } else {
      this.errorMessageImg = 'Error al intentar cargar la imagen.';
    }
    this.clearFileInput();
  }

  public async restauracionDeFabrica() {
    await this.dataService.fetchEmpresa('PUT', new empresa());
    window.location.reload();
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

  public async setNombre(nombre: string) {
    if (nombre.trim() !== this.dataEmpresa.nombre) {
      await this.dataService.fetchEmpresa('PUT', { nombre: nombre.trim() });
      window.location.reload();
    }
  }
}
