import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGraficoIngresosComponent } from './dashboard-grafico-ingresos.component';

describe('DashboardGraficoIngresosComponent', () => {
  let component: DashboardGraficoIngresosComponent;
  let fixture: ComponentFixture<DashboardGraficoIngresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGraficoIngresosComponent]
    });
    fixture = TestBed.createComponent(DashboardGraficoIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
