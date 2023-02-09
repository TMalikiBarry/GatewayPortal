import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAccesReseauComponent } from './dialog-acces-reseau.component';

describe('DialogAccesReseauComponent', () => {
  let component: DialogAccesReseauComponent;
  let fixture: ComponentFixture<DialogAccesReseauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAccesReseauComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAccesReseauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
