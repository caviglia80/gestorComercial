import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGeneralInventarioComponent } from './configuracion-general-inventario.component';

describe('ConfiguracionGeneralInventarioComponent', () => {
  let component: ConfiguracionGeneralInventarioComponent;
  let fixture: ComponentFixture<ConfiguracionGeneralInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionGeneralInventarioComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionGeneralInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
