import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaGeneralComponent } from '@routes/Interno/configuracion-general/configuracion-general.component';
import { EmpresaGeneralAjustesComponent } from '@components/configuracion-general-ajustes/configuracion-general-ajustes.component';
import { EmpresaGeneralEgresoComponent } from '@components/configuracion-general-egreso/configuracion-general-egreso.component';
import { EmpresaGeneralIngresoComponent } from '@components/configuracion-general-ingreso/configuracion-general-ingreso.component';
import { EmpresaGeneralInventarioComponent } from '@components/configuracion-general-inventario/configuracion-general-inventario.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';

const routes: Routes = [
  { path: '', component: EmpresaGeneralComponent },
];

@NgModule({
  declarations: [
    EmpresaGeneralComponent,
    EmpresaGeneralAjustesComponent,
    EmpresaGeneralEgresoComponent,
    EmpresaGeneralIngresoComponent,
    EmpresaGeneralInventarioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedMaterialModule,
    ColorPickerModule
  ],
})
export class EmpresaGeneralModule { }
