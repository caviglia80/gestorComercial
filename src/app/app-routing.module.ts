import { NgModule } from '@angular/core';
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
  { path: 'landingPage', component: LandingPageComponent },
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
  { path: 'roles', component: RolesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
