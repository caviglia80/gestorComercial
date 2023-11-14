import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IngresosComponent } from '@routes/Interno/ingresos/ingresos.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';

const routes: Routes = [
  { path: '', component: IngresosComponent },
];

@NgModule({
  declarations: [IngresosComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  MaterialModule
  ],
})
export class IngresosModule { }
