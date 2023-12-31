import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth.guard';
import { NavComponent } from '@routes/Interno/nav/nav.component';

import { MatSidenavModule } from '@angular/material/sidenav';
//import { MaterialModule } from '@app/shared/modules/material/material.module';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('@routes/Interno/dashboard/dashboard.module').then((m) => m.DashboardModule), canActivate: [authGuard] },
      { path: 'ingresos', loadChildren: () => import('@routes/Interno/ingresos/ingresos.module').then((m) => m.IngresosModule), canActivate: [authGuard] },
      { path: 'egresos', loadChildren: () => import('@routes/Interno/egresos/egresos.module').then((m) => m.EgresosModule), canActivate: [authGuard] },
      { path: 'inventario', loadChildren: () => import('@routes/Interno/inventario/inventario.module').then((m) => m.inventarioModule), canActivate: [authGuard] },
      { path: 'proveedores', loadChildren: () => import('@routes/Interno/proveedores/proveedores.module').then((m) => m.ProveedoresModule), canActivate: [authGuard] },
      { path: 'reportes', loadChildren: () => import('@app/routes/Interno/reportes/reportes.module').then((m) => m.ReportsModule), canActivate: [authGuard] },
      { path: 'general', loadChildren: () => import('@routes/Interno/configuracion-general/configuracion-general.module').then((m) => m.EmpresaConfiguracionModule), canActivate: [authGuard] },
      { path: 'usuarios', loadChildren: () => import('@routes/Interno/usuarios/usuarios.module').then((m) => m.UsuariosModule), canActivate: [authGuard] },
      { path: 'renovacion', loadChildren: () => import('@routes/Interno/renovacion/renovacion.module').then((m) => m.RenovacionModule), canActivate: [authGuard] },
      { path: 'roles', loadChildren: () => import('@routes/Interno/roles/roles.module').then((m) => m.RolesModule), canActivate: [authGuard] },
      { path: 'inicio', loadChildren: () => import('@routes/Interno/inicio/inicio.module').then((m) => m.InicioModule) },
      { path: 'clientes', loadChildren: () => import('@routes/Interno/clientes/clientes.module').then((m) => m.ClientesModule) },
      { path: '**', loadChildren: () => import('@routes/Interno/inicio/inicio.module').then((m) => m.InicioModule) },
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
    //  MaterialModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule
  ]
})
export class InternoModule { }
