import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfiguracionIngresoComponent } from './configuracion-general-ingreso.component';

describe('EmpresaConfiguracionIngresoComponent', () => {
  let component: EmpresaConfiguracionIngresoComponent;
  let fixture: ComponentFixture<EmpresaConfiguracionIngresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaConfiguracionIngresoComponent]
    });
    fixture = TestBed.createComponent(EmpresaConfiguracionIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
