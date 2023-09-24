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
import { CurrencyWithSymbolPipe } from '@pipes/currencyWithSymbol/currency-with-symbol.pipe';
import { TruncatePipe } from '@pipes/truncate/truncate.pipe';
import { DateFormatPipe } from '@pipes/dateFormat/date-format.pipe';
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
import {MatTabsModule} from '@angular/material/tabs';

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
    CurrencyWithSymbolPipe,
    TruncatePipe,
    DateFormatPipe,
    NavComponent,
    ProveedoresComponent,
    ConfiguracionGeneralComponent,
    UsuariosComponent,
    RolesComponent
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
    MatTabsModule
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
