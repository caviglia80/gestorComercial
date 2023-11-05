import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { inventarioComponent } from '@routes/Interno/inventario/inventario.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: inventarioComponent },
];

@NgModule({
  declarations: [inventarioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedMaterialModule
  ],
})
export class inventarioModule { }
