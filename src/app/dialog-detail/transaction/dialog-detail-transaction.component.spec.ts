import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailTransactionComponent } from './dialog-detail-transaction.component';

describe('DialogDetailTransactionComponent', () => {
  let component: DialogDetailTransactionComponent;
  let fixture: ComponentFixture<DialogDetailTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
