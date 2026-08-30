import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameRankingsComponent } from './game-rankings.component';
import { TEST_PROVIDERS } from '../../testing/test-providers';
import { AuthService } from '../../services/auth.service';

describe('GameRankingsComponent', () => {
  let fixture: ComponentFixture<GameRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRankingsComponent],
      providers: [
        TEST_PROVIDERS,
        {
          provide: AuthService,
          useValue: { currentUser: { firebaseUserId: 'test-user' } }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(GameRankingsComponent);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
