import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NavComponent } from '@routes/Interno/nav/nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from '@app/shared/modules/material/material.module';
import { MatListModule } from '@angular/material/list';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('@routes/Interno/dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'ingresos', loadChildren: () => import('@routes/Interno/ingresos/ingresos.module').then((m) => m.IngresosModule) },
      { path: 'egresos', loadChildren: () => import('@routes/Interno/egresos/egresos.module').then((m) => m.EgresosModule) },
      { path: 'inventario', loadChildren: () => import('@routes/Interno/inventario/inventario.module').then((m) => m.inventarioModule) },
      { path: 'proveedores', loadChildren: () => import('@routes/Interno/proveedores/proveedores.module').then((m) => m.ProveedoresModule) },
      { path: 'reportes', loadChildren: () => import('@app/routes/Interno/reportes/reportes.module').then((m) => m.ReportsModule) },
      { path: 'empresaConfiguracion', loadChildren: () => import('@routes/Interno/configuracion-general/configuracion-general.module').then((m) => m.EmpresaConfiguracionModule) },
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
    MaterialModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class InternoModule { }
