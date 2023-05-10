import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSousReseauxComponent } from './dialog-sous-reseaux.component';

describe('DialogReseauxComponent', () => {
  let component: DialogSousReseauxComponent;
  let fixture: ComponentFixture<DialogSousReseauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSousReseauxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSousReseauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
