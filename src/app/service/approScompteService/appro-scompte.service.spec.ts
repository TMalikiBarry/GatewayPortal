import { TestBed } from '@angular/core/testing';

import { ApproScompteService } from './appro-scompte.service';

describe('ApproScompteService', () => {
  let service: ApproScompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproScompteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
