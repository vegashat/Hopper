import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitPickDialogComponent } from './split-pick-dialog.component';
import { TEST_PROVIDERS } from '../../testing/test-providers';

describe('SplitPickDialogComponent', () => {
  let component: SplitPickDialogComponent;
  let fixture: ComponentFixture<SplitPickDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitPickDialogComponent], providers: TEST_PROVIDERS
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
