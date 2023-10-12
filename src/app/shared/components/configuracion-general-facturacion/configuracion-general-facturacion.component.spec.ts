import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralFacturacionComponent } from './configuracion-general-facturacion.component';

describe('ConfiguracionGeneralFacturacionComponent', () => {
  let component: ConfiguracionGeneralFacturacionComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralFacturacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralFacturacionComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionGeneralFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
