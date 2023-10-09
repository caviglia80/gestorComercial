import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesEgresosBPComponent } from './reportes-egresos-bp.component';

describe('ReportesEgresosBPComponent', () => {
  let component: ReportesEgresosBPComponent;
  let fixture: ComponentFixture<ReportesEgresosBPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesEgresosBPComponent]
    });
    fixture = TestBed.createComponent(ReportesEgresosBPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
