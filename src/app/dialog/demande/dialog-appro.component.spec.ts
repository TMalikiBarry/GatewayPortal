import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogApproComponent } from './dialog-appro.component';

describe('DialogApproComponent', () => {
  let component: DialogApproComponent;
  let fixture: ComponentFixture<DialogApproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogApproComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogApproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
