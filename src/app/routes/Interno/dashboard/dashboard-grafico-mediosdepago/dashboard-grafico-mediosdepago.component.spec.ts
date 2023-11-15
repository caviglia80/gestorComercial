import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGraficoMediosdepagoComponent } from './dashboard-grafico-mediosdepago.component';

describe('DashboardGraficoMediosdepagoComponent', () => {
  let component: DashboardGraficoMediosdepagoComponent;
  let fixture: ComponentFixture<DashboardGraficoMediosdepagoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardGraficoMediosdepagoComponent]
    });
    fixture = TestBed.createComponent(DashboardGraficoMediosdepagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
