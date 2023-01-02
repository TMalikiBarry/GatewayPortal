import { TestBed } from '@angular/core/testing';

import { ReseauxService } from './reseaux.service';

describe('ReseauxService', () => {
  let service: ReseauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReseauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
