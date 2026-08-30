import { EnvironmentProviders, Provider } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideToastr } from 'ngx-toastr';
import { SignalRService } from '@services/signalr.service';

const game = {
  gameId: 1,
  seasonId: 1,
  gameDateTime: '2026-10-01T19:00:00-05:00',
  remainingTickets: 4,
  opponent: { teamId: 1, name: 'Test Team' },
  selections: []
};

export const TEST_PROVIDERS: Array<Provider | EnvironmentProviders> = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideNoopAnimations(),
  provideRouter([]),
  provideToastr(),
  { provide: SignalRService, useValue: { connect: () => undefined, on: () => undefined } },
  { provide: MatDialogRef, useValue: { close: () => undefined } },
  {
    provide: MAT_DIALOG_DATA,
    useValue: {
      game,
      participant: { firebaseUserId: 'test-user', displayName: 'Test User', isAdmin: false }
    }
  }
];
