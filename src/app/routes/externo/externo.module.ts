import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from '@routes/Externo/landing-page/landing-page.component';
import { LoginComponent } from '@routes/Externo/login/login.component';
import { RegisterComponent } from '@routes/Externo/register/register.component';
import { PaymentComponent } from '@routes/Externo/payment/payment.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'payment', component: PaymentComponent },
  { path: '**', component: LandingPageComponent },
];

@NgModule({
  declarations: [
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    PaymentComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ExternoModule {}
