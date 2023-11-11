import { TestBed } from '@angular/core/testing';

import { GoToNavOnValidJWTInterceptor } from './go-to-nav-on-valid-jwt.interceptor';

describe('GoToNavOnValidJWTInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GoToNavOnValidJWTInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GoToNavOnValidJWTInterceptor = TestBed.inject(GoToNavOnValidJWTInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
