import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from '@app/routes/Interno/reportes/reportes.component';
import { ReportesEgresosRubroComponent } from './reportes-egresos-rubro/reportes-egresos-rubro.component';
import { ReportesEgresosBPComponent } from './reportes-egresos-bp/reportes-egresos-bp.component';
import { ReportesIngresosComponent } from './reportes-ingresos/reportes-ingresos.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

const routes: Routes = [
  { path: '', component: ReportsComponent },
];

@NgModule({
  declarations: [
    ReportsComponent,
    ReportesIngresosComponent,
    ReportesEgresosRubroComponent,
    ReportesEgresosBPComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule,
    MatTabsModule,
    MatRadioModule
  ],
})
export class ReportsModule { }
