import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralEgresoComponent } from './configuracion-general-egreso.component';

describe('ConfiguracionGeneralEgresoComponent', () => {
  let component: ConfiguracionGeneralEgresoComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralEgresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralEgresoComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionGeneralEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
