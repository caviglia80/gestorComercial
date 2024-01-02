import { TestBed } from '@angular/core/testing';

import { RequestCancelService } from './request-cancel.service';

describe('RequestCancelService', () => {
  let service: RequestCancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestCancelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
