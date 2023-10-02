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
  public tooltipChecked: boolean = false;
  public copyChecked: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    private sharedService: SharedService
  ) { }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.dataInit();
  }

  private dataInit() {
    this.dataService.Configuracion$.subscribe((data) => {
      this.dataSource = data[0];
      if (this.dataSource !== undefined) {
        this.tooltipChecked = this.dataSource.tooltipEnabled == 1;
        this.copyChecked = this.dataSource.copyEnabled == 1;
      }
    });
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

  public habilitarTooltip(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, tooltipEnabled: isChecked ? "true" : "false" });
  }

  public habilitarCopy(isChecked: boolean) {
    this.dataService.fetchConfiguracion('PUT', { id: 1, copyEnabled: isChecked ? "true" : "false" });
  }











}
