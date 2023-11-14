import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from '@routes/Interno/proveedores/proveedores.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';

const routes: Routes = [
  { path: '', component: ProveedoresComponent },
];

@NgModule({
  declarations: [ProveedoresComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  MaterialModule
  ],
})
export class ProveedoresModule { }
