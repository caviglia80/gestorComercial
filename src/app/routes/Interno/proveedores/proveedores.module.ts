import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from '@routes/Interno/proveedores/proveedores.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: ProveedoresComponent },
];

@NgModule({
  declarations: [ProveedoresComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  SharedMaterialModule
  ],
})
export class ProveedoresModule { }
