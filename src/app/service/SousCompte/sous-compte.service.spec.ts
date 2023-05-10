import { TestBed } from '@angular/core/testing';

import { SousCompteService } from './sous-compte.service';

describe('SousCompteService', () => {
  let service: SousCompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousCompteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
