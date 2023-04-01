import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogControlTransComponent } from './dialog-control-trans.component';

describe('DialogControlTransComponent', () => {
  let component: DialogControlTransComponent;
  let fixture: ComponentFixture<DialogControlTransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogControlTransComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogControlTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
