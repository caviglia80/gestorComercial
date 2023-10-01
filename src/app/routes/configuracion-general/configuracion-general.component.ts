import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { SharedService } from '@services/shared/shared.service';
import { DataService } from '@services/data/data.service';
import { facturacionAuth } from '@models/mainClasses/main-classes';
import { AfipService } from '@services/afip/afip.service';
import { AfipRequest } from '@models/afipRequest/afip-request';

@Component({
  selector: 'app-configuracion-general',
  templateUrl: './configuracion-general.component.html',
  styleUrls: ['./configuracion-general.component.css']
})
export class ConfiguracionGeneralComponent implements AfterViewInit {

  constructor(
    public dataService: DataService,
    private sharedService: SharedService,
   /*  private cdr: ChangeDetectorRef */
  ) { }

  ngAfterViewInit() {
  /*   this.cdr.detectChanges(); */
  }


















}








