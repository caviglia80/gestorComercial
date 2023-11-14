import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaGeneralEgresoComponent } from './configuracion-general-egreso.component';

describe('EmpresaGeneralEgresoComponent', () => {
  let component: EmpresaGeneralEgresoComponent;
  let fixture: ComponentFixture<EmpresaGeneralEgresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaGeneralEgresoComponent]
    });
    fixture = TestBed.createComponent(EmpresaGeneralEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
