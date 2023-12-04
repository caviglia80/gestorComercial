import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '@routes/externo/register/register.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';

const routes: Routes = [
  { path: '', component: RegisterComponent },
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  MaterialModule
  ],
})
export class RegisterModule { }
