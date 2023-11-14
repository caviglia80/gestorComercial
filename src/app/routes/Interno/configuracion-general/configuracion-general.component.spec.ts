import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaConfiguracionComponent } from './configuracion-general.component';

describe('EmpresaConfiguracionComponent', () => {
  let component: EmpresaConfiguracionComponent;
  let fixture: ComponentFixture<EmpresaConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaConfiguracionComponent]
    });
    fixture = TestBed.createComponent(EmpresaConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
