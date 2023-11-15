import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfiguracionInventarioComponent } from './configuracion-general-inventario.component';

describe('EmpresaConfiguracionInventarioComponent', () => {
  let component: EmpresaConfiguracionInventarioComponent;
  let fixture: ComponentFixture<EmpresaConfiguracionInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaConfiguracionInventarioComponent]
    });
    fixture = TestBed.createComponent(EmpresaConfiguracionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
