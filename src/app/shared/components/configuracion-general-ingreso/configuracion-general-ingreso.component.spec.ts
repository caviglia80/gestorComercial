import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaGeneralIngresoComponent } from './configuracion-general-ingreso.component';

describe('EmpresaGeneralIngresoComponent', () => {
  let component: EmpresaGeneralIngresoComponent;
  let fixture: ComponentFixture<EmpresaGeneralIngresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaGeneralIngresoComponent]
    });
    fixture = TestBed.createComponent(EmpresaGeneralIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
