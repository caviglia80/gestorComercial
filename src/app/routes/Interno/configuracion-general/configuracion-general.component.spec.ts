import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaGeneralComponent } from './configuracion-general.component';

describe('EmpresaGeneralComponent', () => {
  let component: EmpresaGeneralComponent;
  let fixture: ComponentFixture<EmpresaGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaGeneralComponent]
    });
    fixture = TestBed.createComponent(EmpresaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
