import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionGeneralComponent } from '@routes/Interno/configuracion-general/configuracion-general.component';
import { ConfiguracionGeneralAjustesComponent } from '@components/configuracion-general-ajustes/configuracion-general-ajustes.component';
import { ConfiguracionGeneralEgresoComponent } from '@components/configuracion-general-egreso/configuracion-general-egreso.component';
import { ConfiguracionGeneralIngresoComponent } from '@components/configuracion-general-ingreso/configuracion-general-ingreso.component';
import { ConfiguracionGeneralFacturacionComponent } from '@components/configuracion-general-facturacion/configuracion-general-facturacion.component';
import { ConfiguracionGeneralInventarioComponent } from '@components/configuracion-general-inventario/configuracion-general-inventario.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';

const routes: Routes = [
  { path: '', component: ConfiguracionGeneralComponent },
];

@NgModule({
  declarations: [
    ConfiguracionGeneralComponent,
    ConfiguracionGeneralAjustesComponent,
    ConfiguracionGeneralEgresoComponent,
    ConfiguracionGeneralIngresoComponent,
    ConfiguracionGeneralFacturacionComponent,
    ConfiguracionGeneralInventarioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedMaterialModule,
    ColorPickerModule
  ],
})
export class ConfiguracionGeneralModule { }
