import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EgresosComponent } from '@routes/Interno/egresos/egresos.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: EgresosComponent },
];

@NgModule({
  declarations: [EgresosComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  SharedMaterialModule
  ],
})
export class EgresosModule { }
