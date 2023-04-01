import { TestBed } from '@angular/core/testing';

import { ControlTransactionService } from './control-transaction.service';

describe('ControlTransactionService', () => {
  let service: ControlTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
