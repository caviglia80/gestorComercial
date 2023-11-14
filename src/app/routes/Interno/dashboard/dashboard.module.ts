import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@routes/Interno/dashboard/dashboard.component';
import { DashboardGraficoIngresosComponent } from '@components/dashboard-grafico-ingresos/dashboard-grafico-ingresos.component';
import { DashboardGraficoEgresosComponent } from '@components/dashboard-grafico-egresos/dashboard-grafico-egresos.component';
import { DashboardGraficoMargenComponent } from '@components/dashboard-grafico-margen/dashboard-grafico-margen.component';
import { DashboardGraficoMargenMenosEgresosComponent } from '@components/dashboard-grafico-margen-menos-egresos/dashboard-grafico-margen-menos-egresos.component';
import { DashboardGraficoMediosdepagoComponent } from '@components/dashboard-grafico-mediosdepago/dashboard-grafico-mediosdepago.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';
import { NgChartsModule } from 'ng2-charts';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardGraficoIngresosComponent,
    DashboardGraficoEgresosComponent,
    DashboardGraficoMargenComponent,
    DashboardGraficoMargenMenosEgresosComponent,
    DashboardGraficoMediosdepagoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgChartsModule
  ],
})
export class DashboardModule { }
