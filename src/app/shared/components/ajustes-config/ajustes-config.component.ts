import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { configuracion } from '@models/mainClasses/main-classes';

@Component({
  selector: 'app-ajustes-config',
  templateUrl: './ajustes-config.component.html',
  styleUrls: ['./ajustes-config.component.css']
})
export class AjustesConfigComponent implements AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  public errorMessageImg: boolean = false;
  public dataSource: any;

  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    private sharedService: SharedService
  ) { }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
          this.dataService.fetchConfiguracion('PUT', { id: 1, icono: Base64 });
        });
      }
    }
  }

  public restauracionDeFabrica() {
    this.dataService.fetchConfiguracion('PUT', new configuracion());
  }


}
