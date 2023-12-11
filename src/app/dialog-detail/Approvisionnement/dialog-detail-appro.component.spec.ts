import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailApproComponent } from './dialog-detail-appro.component';

describe('DialogDetailApproComponent', () => {
  let component: DialogDetailApproComponent;
  let fixture: ComponentFixture<DialogDetailApproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailApproComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetailApproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
