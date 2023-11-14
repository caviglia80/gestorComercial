import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfiguracionEgresoComponent } from './configuracion-general-egreso.component';

describe('EmpresaConfiguracionEgresoComponent', () => {
  let component: EmpresaConfiguracionEgresoComponent;
  let fixture: ComponentFixture<EmpresaConfiguracionEgresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaConfiguracionEgresoComponent]
    });
    fixture = TestBed.createComponent(EmpresaConfiguracionEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
