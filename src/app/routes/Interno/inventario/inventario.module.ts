import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { inventarioComponent } from '@routes/Interno/inventario/inventario.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';

const routes: Routes = [
  { path: '', component: inventarioComponent },
];

@NgModule({
  declarations: [inventarioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
})
export class inventarioModule { }
