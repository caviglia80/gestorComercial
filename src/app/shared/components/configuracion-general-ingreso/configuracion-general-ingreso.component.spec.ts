import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralIngresoComponent } from './configuracion-general-ingreso.component';

describe('ConfiguracionGeneralIngresoComponent', () => {
  let component: ConfiguracionGeneralIngresoComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralIngresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralIngresoComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionGeneralIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
