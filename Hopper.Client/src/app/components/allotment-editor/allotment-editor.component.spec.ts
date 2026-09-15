import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AllotmentEditorComponent } from './allotment-editor.component';
import { AuthService } from '@services/auth.service';
import { DraftService } from '@services/draft.service';
import { GamesService } from '@services/games.service';

describe('AllotmentEditorComponent', () => {
  it('enforces shared capacity, picked tickets, and whole numbers', () => {
    const save = jasmine.createSpy();
    TestBed.configureTestingModule({ providers: [
      { provide: AuthService, useValue: {} },
      { provide: DraftService, useValue: { updateAllotment: save } },
      { provide: GamesService, useValue: { getSeasonGames: () => of([{}, {}, {}]) } }
    ] });
    const component = TestBed.runInInjectionContext(() => new AllotmentEditorComponent());
    component.user = { firebaseUserId: 'a', displayName: 'A', allotment: 4, picked: 2, remaining: 2 };
    component.status = { seasonId: 1, isActive: true, upcoming: [], history: [], totalTicketsRemaining: 6,
      users: [component.user, { firebaseUserId: 'b', displayName: 'B', allotment: 6, picked: 2, remaining: 4 }] };
    component.begin();
    expect(component.capacity).toBe(12);
    expect(component.maximum).toBe(6);
    for (const value of [2, 6]) {
      component.value = value;
      expect(component.valid).toBeTrue();
    }
    for (const value of [7, 1, -1, null, 2.5]) {
      component.value = value;
      expect(component.valid).toBeFalse();
      component.save();
    }
    expect(save).not.toHaveBeenCalled();
  });
});
