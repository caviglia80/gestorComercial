import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGraficoMargenComponent } from './dashboard-grafico-utilidad-bruta.component';

describe('DashboardGraficoMargenComponent', () => {
  let component: DashboardGraficoMargenComponent;
  let fixture: ComponentFixture<DashboardGraficoMargenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGraficoMargenComponent]
    });
    fixture = TestBed.createComponent(DashboardGraficoMargenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
