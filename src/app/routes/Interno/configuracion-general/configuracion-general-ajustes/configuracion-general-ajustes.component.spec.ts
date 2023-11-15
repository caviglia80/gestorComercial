import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfiguracionAjustesComponent } from './configuracion-general-ajustes.component';

describe('EmpresaConfiguracionAjustesComponent', () => {
  let component: EmpresaConfiguracionAjustesComponent;
  let fixture: ComponentFixture<EmpresaConfiguracionAjustesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaConfiguracionAjustesComponent]
    });
    fixture = TestBed.createComponent(EmpresaConfiguracionAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
