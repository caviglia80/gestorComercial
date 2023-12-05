import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '@routes/Interno/inicio/inicio.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
];

@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class InicioModule { }
