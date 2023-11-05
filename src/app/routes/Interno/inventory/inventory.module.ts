import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from '@routes/Interno/inventory/inventory.component';
import { SharedMaterialModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: InventoryComponent },
];

@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedMaterialModule
  ],
})
export class InventoryModule { }
