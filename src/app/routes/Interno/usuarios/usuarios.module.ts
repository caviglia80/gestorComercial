import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from '@routes/Interno/usuarios/usuarios.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: UsuariosComponent },
];

@NgModule({
  declarations: [UsuariosComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  SharedMaterialModule
  ],
})
export class UsuariosModule { }
