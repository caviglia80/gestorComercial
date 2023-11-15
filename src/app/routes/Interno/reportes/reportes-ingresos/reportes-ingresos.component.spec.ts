import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesIngresosComponent } from './reportes-ingresos.component';

describe('ReportesIngresosComponent', () => {
  let component: ReportesIngresosComponent;
  let fixture: ComponentFixture<ReportesIngresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesIngresosComponent]
    });
    fixture = TestBed.createComponent(ReportesIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
