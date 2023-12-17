import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from '@routes/Interno/clientes/clientes.component';
import { MaterialModule } from '@app/shared/modules/material/material.module';

const routes: Routes = [
  { path: '', component: ClientesComponent },
];

@NgModule({
  declarations: [ClientesComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  MaterialModule
  ],
})
export class ClientesModule { }
