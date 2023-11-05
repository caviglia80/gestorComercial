import { ComponentFixture, TestBed } from '@angular/core/testing';

import { inventarioComponent } from './inventario.component';

describe('inventarioComponent', () => {
  let component: inventarioComponent;
  let fixture: ComponentFixture<inventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [inventarioComponent]
    });
    fixture = TestBed.createComponent(inventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
