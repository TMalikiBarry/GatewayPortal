import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousReseauxComponent } from './sous-reseaux.component';

describe('ReseauxComponent', () => {
  let component: SousReseauxComponent;
  let fixture: ComponentFixture<SousReseauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousReseauxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousReseauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
