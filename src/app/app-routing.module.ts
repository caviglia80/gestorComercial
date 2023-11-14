import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('@routes/Externo/landing-page/landing-page.module').then((m) => m.LandingPageModule) },
  { path: 'login', loadChildren: () => import('@routes/Externo/login/login.module').then((m) => m.LoginModule) },
  { path: 'register', loadChildren: () => import('@routes/Externo/register/register.module').then((m) => m.RegisterModule) },
  { path: 'payment', loadChildren: () => import('@routes/Externo/payment/payment.module').then((m) => m.PaymentModule) },

  { path: 'nav', loadChildren: () => import('@app/routes/Interno/nav/nav.module').then((m) => m.InternoModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
