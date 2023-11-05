import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralComponent } from './configuracion-general.component';

describe('ConfiguracionGeneralComponent', () => {
  let component: ConfiguracionGeneralComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
