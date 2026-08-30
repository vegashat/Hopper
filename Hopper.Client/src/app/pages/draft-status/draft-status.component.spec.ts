import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftStatusComponent } from './draft-status.component';
import { TEST_PROVIDERS } from '../../testing/test-providers';

describe('DraftStatusComponent', () => {
  let component: DraftStatusComponent;
  let fixture: ComponentFixture<DraftStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftStatusComponent], providers: TEST_PROVIDERS
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
