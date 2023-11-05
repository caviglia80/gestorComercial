import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from '@routes/Interno/roles/roles.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: RolesComponent },
];

@NgModule({
  declarations: [RolesComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  SharedMaterialModule
  ],
})
export class RolesModule { }
