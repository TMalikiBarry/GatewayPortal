import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTransactionComponent } from './control-transaction.component';

describe('ControlTransactionComponent', () => {
  let component: ControlTransactionComponent;
  let fixture: ComponentFixture<ControlTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
