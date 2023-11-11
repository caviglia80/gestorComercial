import { TestBed } from '@angular/core/testing';

import { SetJwtInterceptor } from './set-jwt.interceptor';

describe('SetJwtInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SetJwtInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SetJwtInterceptor = TestBed.inject(SetJwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
