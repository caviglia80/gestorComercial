import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesEgresosComponent } from './reportes-egresos.component';

describe('ReportesEgresosComponent', () => {
  let component: ReportesEgresosComponent;
  let fixture: ComponentFixture<ReportesEgresosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesEgresosComponent]
    });
    fixture = TestBed.createComponent(ReportesEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
