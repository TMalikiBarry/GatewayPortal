import { TestBed } from '@angular/core/testing';

import { DossierServiceService } from './dossier.service';

describe('DossierServiceService', () => {
  let service: DossierServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
