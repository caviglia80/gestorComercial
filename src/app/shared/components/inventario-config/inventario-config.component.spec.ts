import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioConfigComponent } from './inventario-config.component';

describe('InventarioConfigComponent', () => {
  let component: InventarioConfigComponent;
  let fixture: ComponentFixture<InventarioConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventarioConfigComponent]
    });
    fixture = TestBed.createComponent(InventarioConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
