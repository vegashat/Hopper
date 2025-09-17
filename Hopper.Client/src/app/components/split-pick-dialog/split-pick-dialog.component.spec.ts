import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitPickDialogComponent } from './split-pick-dialog.component';

describe('SplitPickDialogComponent', () => {
  let component: SplitPickDialogComponent;
  let fixture: ComponentFixture<SplitPickDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitPickDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitPickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
