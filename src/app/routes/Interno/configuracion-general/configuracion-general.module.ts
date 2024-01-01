import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaConfiguracionComponent } from '@routes/Interno/configuracion-general/configuracion-general.component';
import { EmpresaConfiguracionAjustesComponent } from './configuracion-general-ajustes/configuracion-general-ajustes.component';
import { EmpresaConfiguracionEgresoComponent } from './configuracion-general-egreso/configuracion-general-egreso.component';
import { EmpresaConfiguracionIngresoComponent } from './configuracion-general-ingreso/configuracion-general-ingreso.component';
import { EmpresaConfiguracionInventarioComponent } from './configuracion-general-inventario/configuracion-general-inventario.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  { path: '', component: EmpresaConfiguracionComponent },
];

@NgModule({
  declarations: [
    EmpresaConfiguracionComponent,
    EmpresaConfiguracionAjustesComponent,
    EmpresaConfiguracionEgresoComponent,
    EmpresaConfiguracionIngresoComponent,
    EmpresaConfiguracionInventarioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ColorPickerModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
})
export class EmpresaConfiguracionModule { }
