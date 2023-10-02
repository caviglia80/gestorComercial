import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesConfigComponent } from './ajustes-config.component';

describe('AjustesConfigComponent', () => {
  let component: AjustesConfigComponent;
  let fixture: ComponentFixture<AjustesConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjustesConfigComponent]
    });
    fixture = TestBed.createComponent(AjustesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
