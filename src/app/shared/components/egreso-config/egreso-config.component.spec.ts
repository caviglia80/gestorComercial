import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresoConfigComponent } from './egreso-config.component';

describe('EgresoConfigComponent', () => {
  let component: EgresoConfigComponent;
  let fixture: ComponentFixture<EgresoConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EgresoConfigComponent]
    });
    fixture = TestBed.createComponent(EgresoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
