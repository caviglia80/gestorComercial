import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NavComponent } from '@components/nav/nav.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProveedoresComponent } from '@routes/proveedores/proveedores.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfiguracionGeneralComponent } from '@routes/configuracion-general/configuracion-general.component';
import { UsuariosComponent } from '@routes/usuarios/usuarios.component';
import { RolesComponent } from '@routes/roles/roles.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { registerLocaleData } from '@angular/common';
import localeEsES from '@angular/common/locales/es';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FacturacionConfigComponent } from './shared/components/facturacion-config/facturacion-config.component';
import { AjustesConfigComponent } from './shared/components/ajustes-config/ajustes-config.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InventarioConfigComponent } from './shared/components/inventario-config/inventario-config.component';
import { PvpPipe } from './core/pipes/pvp/pvp.pipe';
import { IngresoConfigComponent } from './shared/components/ingreso-config/ingreso-config.component';
import { EgresoConfigComponent } from './shared/components/egreso-config/egreso-config.component';
import { ReportesIngresosComponent } from './shared/components/reportes-ingresos/reportes-ingresos.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatRadioModule} from '@angular/material/radio';
import { ReportesEgresosRubroComponent } from './shared/components/reportes-egresos-rubro/reportes-egresos-rubro.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    PaymentComponent,
    DashboardComponent,
    IngresosComponent,
    EgresosComponent,
    InventoryComponent,
    ReportsComponent,
    BillingComponent,
    TruncatePipe,
    NavComponent,
    ProveedoresComponent,
    ConfiguracionGeneralComponent,
    UsuariosComponent,
    RolesComponent,
    FacturacionConfigComponent,
    AjustesConfigComponent,
    InventarioConfigComponent,
    PvpPipe,
    IngresoConfigComponent,
    EgresoConfigComponent,
    ReportesIngresosComponent,
    ReportesEgresosRubroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    HttpClientModule,
    MatTooltipModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    ColorPickerModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    MatRadioModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeEsES, 'es-ES');
  }
}
