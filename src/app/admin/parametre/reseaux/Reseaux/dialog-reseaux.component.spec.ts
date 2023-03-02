import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReseauxComponent } from './dialog-reseaux.component';

describe('DialogReseauxComponent', () => {
  let component: DialogReseauxComponent;
  let fixture: ComponentFixture<DialogReseauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogReseauxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogReseauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
