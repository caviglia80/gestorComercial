import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralAjustesComponent } from './configuracion-general-ajustes.component';

describe('ConfiguracionGeneralAjustesComponent', () => {
  let component: ConfiguracionGeneralAjustesComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralAjustesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralAjustesComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionGeneralAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
