import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'landing', loadChildren: () => import('@routes/Externo/externo.module').then((m) => m.ExternoModule) },
  { path: 'nav', loadChildren: () => import('@routes/Interno/interno.module').then((m) => m.InternoModule) },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
/*   { path: '**', redirectTo: '/landing', pathMatch: 'full' }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
