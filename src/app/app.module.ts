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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PvpPipe } from './core/pipes/pvp/pvp.pipe';
import { ReportesIngresosComponent } from '@components/reportes-ingresos/reportes-ingresos.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatRadioModule} from '@angular/material/radio';
import { ReportesEgresosRubroComponent } from '@components/reportes-egresos-rubro/reportes-egresos-rubro.component';
import { ReportesEgresosBPComponent } from '@components/reportes-egresos-bp/reportes-egresos-bp.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardGraficoIngresosComponent } from '@components/dashboard-grafico-ingresos/dashboard-grafico-ingresos.component';
import { ConfiguracionGeneralAjustesComponent } from '@components/configuracion-general-ajustes/configuracion-general-ajustes.component';
import { ConfiguracionGeneralEgresoComponent } from '@components/configuracion-general-egreso/configuracion-general-egreso.component';
import { ConfiguracionGeneralIngresoComponent } from '@components/configuracion-general-ingreso/configuracion-general-ingreso.component';
import { ConfiguracionGeneralFacturacionComponent } from '@components/configuracion-general-facturacion/configuracion-general-facturacion.component';
import { ConfiguracionGeneralInventarioComponent } from '@components/configuracion-general-inventario/configuracion-general-inventario.component';
import { DashboardGraficoEgresosComponent } from '@components/dashboard-grafico-egresos/dashboard-grafico-egresos.component';
import { DashboardGraficoMargenComponent } from '@components/dashboard-grafico-margen/dashboard-grafico-margen.component';
import { DashboardGraficoMargenMenosEgresosComponent } from '@components/dashboard-grafico-margen-menos-egresos/dashboard-grafico-margen-menos-egresos.component';
import { DashboardGraficoMediosdepagoComponent } from '@components/dashboard-grafico-mediosdepago/dashboard-grafico-mediosdepago.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


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
    PvpPipe,
    ReportesIngresosComponent,
    ReportesEgresosRubroComponent,
    ReportesEgresosBPComponent,
    DashboardGraficoIngresosComponent,
    ConfiguracionGeneralAjustesComponent,
    ConfiguracionGeneralEgresoComponent,
    ConfiguracionGeneralIngresoComponent,
    ConfiguracionGeneralFacturacionComponent,
    ConfiguracionGeneralInventarioComponent,
    DashboardGraficoEgresosComponent,
    DashboardGraficoMargenComponent,
    DashboardGraficoMargenMenosEgresosComponent,
    DashboardGraficoMediosdepagoComponent
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
    MatRadioModule,
    NgChartsModule,
    MatButtonToggleModule
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
