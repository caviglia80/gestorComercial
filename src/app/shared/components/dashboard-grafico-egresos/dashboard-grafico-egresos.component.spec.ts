import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGraficoEgresosComponent } from './dashboard-grafico-egresos.component';

describe('DashboardGraficoEgresosComponent', () => {
  let component: DashboardGraficoEgresosComponent;
  let fixture: ComponentFixture<DashboardGraficoEgresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGraficoEgresosComponent]
    });
    fixture = TestBed.createComponent(DashboardGraficoEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
