import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoIngresosDashboardComponent } from './grafico-ingresos-dashboard.component';

describe('GraficoIngresosDashboardComponent', () => {
  let component: GraficoIngresosDashboardComponent;
  let fixture: ComponentFixture<GraficoIngresosDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoIngresosDashboardComponent]
    });
    fixture = TestBed.createComponent(GraficoIngresosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
