import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoConfigComponent } from './ingreso-config.component';

describe('IngresoConfigComponent', () => {
  let component: IngresoConfigComponent;
  let fixture: ComponentFixture<IngresoConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngresoConfigComponent]
    });
    fixture = TestBed.createComponent(IngresoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
