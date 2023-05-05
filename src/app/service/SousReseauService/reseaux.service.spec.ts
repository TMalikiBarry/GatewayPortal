import { TestBed } from '@angular/core/testing';

import { SousReseauxService } from './sous-reseaux.service';

describe('ReseauxService', () => {
  let service: SousReseauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousReseauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
