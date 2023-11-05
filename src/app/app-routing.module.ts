/* import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '@routes/login/login.component';
import { RegisterComponent } from '@routes/register/register.component';
import { LandingPageComponent } from '@routes/landing-page/landing-page.component';
import { PaymentComponent } from '@routes/payment/payment.component';
import { DashboardComponent } from '@routes/dashboard/dashboard.component';
import { IngresosComponent } from '@routes/ingresos/ingresos.component';
import { EgresosComponent } from '@routes/egresos/egresos.component';
import { InventoryComponent } from '@routes/inventory/inventory.component';
import { ReportsComponent } from '@routes/reports/reports.component';
import { BillingComponent } from '@routes/billing/billing.component';
import { ProveedoresComponent } from '@routes/proveedores/proveedores.component';
import { ConfiguracionGeneralComponent } from '@routes/configuracion-general/configuracion-general.component';
import { UsuariosComponent } from '@routes/usuarios/usuarios.component';
import { RolesComponent } from '@routes/roles/roles.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'egresos', component: EgresosComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'configuracionGeneral', component: ConfiguracionGeneralComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'roles', component: RolesComponent },
  { path: '', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from '@routes/externo/landing-page/landing-page.component';
import { LoginComponent } from '@routes/externo/login/login.component';
import { RegisterComponent } from '@routes/externo/register/register.component';
import { PaymentComponent } from '@routes/externo/payment/payment.component';

import { NavComponent } from '@components/nav/nav.component';

import { DashboardComponent } from '@routes/Interno/dashboard/dashboard.component';
import { IngresosComponent } from '@routes/Interno/ingresos/ingresos.component';
import { EgresosComponent } from '@routes/Interno/egresos/egresos.component';
import { InventoryComponent } from '@routes/Interno/inventory/inventory.component';
import { ReportsComponent } from '@routes/Interno/reports/reports.component';
import { ProveedoresComponent } from '@routes/Interno/proveedores/proveedores.component';
import { ConfiguracionGeneralComponent } from '@routes/Interno/configuracion-general/configuracion-general.component';
import { UsuariosComponent } from '@routes/Interno/usuarios/usuarios.component';
import { RolesComponent } from '@routes/Interno/roles/roles.component';




const routes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'payment', component: PaymentComponent },
  {
    path: 'nav', component: NavComponent, children: [
      { path: 'dashboard', component: DashboardComponent }, // Ruta predeterminada dentro del nav
      { path: 'ingresos', component: IngresosComponent },
      { path: 'egresos', component: EgresosComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'configuracionGeneral', component: ConfiguracionGeneralComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      // Otras rutas dentro del nav
      { path: '', redirectTo: '/nav/dashboard', pathMatch: 'full' }, // Ruta predeterminada dentro del nav
      { path: '**', redirectTo: '/nav/dashboard', pathMatch: 'full' }, // Ruta predeterminada dentro del nav
    ],
  },
  // Otras rutas principales
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

