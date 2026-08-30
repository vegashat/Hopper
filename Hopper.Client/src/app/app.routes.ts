import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { GamesListComponent } from './pages/games-list/games-list.component';
import { adminGuard } from './services/admin.guard';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'games', component: GamesListComponent },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/history/history.component').then(m => m.HistoryComponent),
      },

      {
        path: 'participants',
        loadComponent: () =>
          import('./pages/participants/participants.component').then(m => m.ParticipantsComponent),
      },
      {
        path: 'rankings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/game-rankings/game-rankings.component').then(m => m.GameRankingsComponent),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin/admin.component').then(m => m.AdminComponent),
      },
      {
        path: 'progress',
        loadComponent: () =>
          import('./pages/progress/progress.component').then(m => m.ProgressComponent),
      },
      {
        path: 'draft-status',
        loadComponent: () =>
          import('./pages/draft-status/draft-status.component').then(m => m.DraftStatusComponent),
      },
      { path: '', redirectTo: 'games', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' }, // fallback
];
