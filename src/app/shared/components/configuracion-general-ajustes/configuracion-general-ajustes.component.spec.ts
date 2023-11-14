import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaGeneralAjustesComponent } from './configuracion-general-ajustes.component';

describe('EmpresaGeneralAjustesComponent', () => {
  let component: EmpresaGeneralAjustesComponent;
  let fixture: ComponentFixture<EmpresaGeneralAjustesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaGeneralAjustesComponent]
    });
    fixture = TestBed.createComponent(EmpresaGeneralAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
