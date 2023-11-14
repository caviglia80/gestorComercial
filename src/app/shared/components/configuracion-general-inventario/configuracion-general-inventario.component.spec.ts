import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaGeneralInventarioComponent } from './configuracion-general-inventario.component';

describe('EmpresaGeneralInventarioComponent', () => {
  let component: EmpresaGeneralInventarioComponent;
  let fixture: ComponentFixture<EmpresaGeneralInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaGeneralInventarioComponent]
    });
    fixture = TestBed.createComponent(EmpresaGeneralInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
