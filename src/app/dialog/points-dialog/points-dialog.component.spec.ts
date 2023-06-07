import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsDialogComponent } from './points-dialog.component';

describe('PointsDialogComponent', () => {
  let component: PointsDialogComponent;
  let fixture: ComponentFixture<PointsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
