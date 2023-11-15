import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesEgresosRubroComponent } from './reportes-egresos-rubro.component';

describe('ReportesEgresosRubroComponent', () => {
  let component: ReportesEgresosRubroComponent;
  let fixture: ComponentFixture<ReportesEgresosRubroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesEgresosRubroComponent]
    });
    fixture = TestBed.createComponent(ReportesEgresosRubroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
