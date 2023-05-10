import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSousCompteComponent } from './dialog-sous-compte.component';

describe('SousCompteComponent', () => {
  let component: DialogSousCompteComponent;
  let fixture: ComponentFixture<DialogSousCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSousCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSousCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
