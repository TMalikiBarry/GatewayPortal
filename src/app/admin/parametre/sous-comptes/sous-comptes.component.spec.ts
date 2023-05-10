import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousComptesComponent } from './sous-comptes.component';

describe('SousComptesComponent', () => {
  let component: SousComptesComponent;
  let fixture: ComponentFixture<SousComptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousComptesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
