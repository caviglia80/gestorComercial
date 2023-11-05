import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from '@routes/Interno/nav/nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '@modules/shared/shared.module';
import { MatListModule } from '@angular/material/list';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('@routes/Interno/dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'ingresos', loadChildren: () => import('@routes/Interno/ingresos/ingresos.module').then((m) => m.IngresosModule) },
      { path: 'egresos', loadChildren: () => import('@routes/Interno/egresos/egresos.module').then((m) => m.EgresosModule) },
      { path: 'inventory', loadChildren: () => import('@routes/Interno/inventory/inventory.module').then((m) => m.InventoryModule) },
      { path: 'proveedores', loadChildren: () => import('@routes/Interno/proveedores/proveedores.module').then((m) => m.ProveedoresModule) },
      { path: 'reports', loadChildren: () => import('@routes/Interno/reports/reports.module').then((m) => m.ReportsModule) },
      { path: 'configuracionGeneral', loadChildren: () => import('@routes/Interno/configuracion-general/configuracion-general.module').then((m) => m.ConfiguracionGeneralModule) },
      { path: 'usuarios', loadChildren: () => import('@routes/Interno/usuarios/usuarios.module').then((m) => m.UsuariosModule) },
      { path: 'roles', loadChildren: () => import('@routes/Interno/roles/roles.module').then((m) => m.RolesModule) },
      { path: '**', loadChildren: () => import('@routes/Interno/dashboard/dashboard.module').then((m) => m.DashboardModule) },
    ],
  },
];

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedMaterialModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class InternoModule { }
