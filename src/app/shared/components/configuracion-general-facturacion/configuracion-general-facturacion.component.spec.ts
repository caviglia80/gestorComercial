import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaGeneralFacturacionComponent } from './configuracion-general-facturacion.component';

describe('EmpresaGeneralFacturacionComponent', () => {
  let component: EmpresaGeneralFacturacionComponent;
  let fixture: ComponentFixture<EmpresaGeneralFacturacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaGeneralFacturacionComponent]
    });
    fixture = TestBed.createComponent(EmpresaGeneralFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
