import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAccesSCompteComponent } from './dialog-acces-s-compte.component';

describe('DialogAccesReseauComponent', () => {
  let component: DialogAccesSCompteComponent;
  let fixture: ComponentFixture<DialogAccesSCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAccesSCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAccesSCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
