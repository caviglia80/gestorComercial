import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionConfigComponent } from './facturacion-config.component';

describe('FacturacionConfigComponent', () => {
  let component: FacturacionConfigComponent;
  let fixture: ComponentFixture<FacturacionConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturacionConfigComponent]
    });
    fixture = TestBed.createComponent(FacturacionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
