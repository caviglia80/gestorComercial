import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TInventarioComponent } from './t-inventario.component';

describe('TInventarioComponent', () => {
  let component: TInventarioComponent;
  let fixture: ComponentFixture<TInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TInventarioComponent]
    });
    fixture = TestBed.createComponent(TInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
