import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGraficoMargenMenosEgresosComponent } from './dashboard-grafico-utilidad-operativa.component';

describe('DashboardGraficoMargenMenosEgresosComponent', () => {
  let component: DashboardGraficoMargenMenosEgresosComponent;
  let fixture: ComponentFixture<DashboardGraficoMargenMenosEgresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGraficoMargenMenosEgresosComponent]
    });
    fixture = TestBed.createComponent(DashboardGraficoMargenMenosEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
