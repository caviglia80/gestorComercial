import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from '@app/routes/Interno/reportes/reportes.component';
import { ReportesEgresosRubroComponent } from '@components/reportes-egresos-rubro/reportes-egresos-rubro.component';
import { ReportesEgresosBPComponent } from '@components/reportes-egresos-bp/reportes-egresos-bp.component';
import { ReportesIngresosComponent } from '@components/reportes-ingresos/reportes-ingresos.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

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
  FlexLayoutModule
  ],
})
export class ReportsModule { }
