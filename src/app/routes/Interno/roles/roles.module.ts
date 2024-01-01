import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from '@routes/Interno/roles/roles.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [
  { path: '', component: RolesComponent },
];

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MatSlideToggleModule
  ],
})
export class RolesModule { }
