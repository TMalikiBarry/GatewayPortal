import { TestBed } from '@angular/core/testing';

import { ServiceTransService } from './service-trans.service';

describe('ServiceTransService', () => {
  let service: ServiceTransService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTransService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
