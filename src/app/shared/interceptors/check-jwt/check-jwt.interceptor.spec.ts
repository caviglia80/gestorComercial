import { TestBed } from '@angular/core/testing';

import { CheckJwtInterceptor } from './check-jwt.interceptor';

describe('CheckJwtInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CheckJwtInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CheckJwtInterceptor = TestBed.inject(CheckJwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
