import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from '@routes/Externo/landing-page/landing-page.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
];

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
  CommonModule,
  RouterModule.forChild(routes),
  SharedMaterialModule
  ],
})
export class LandingPageModule { }
