import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { GamesListComponent } from './pages/games-list/games-list.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'games', component: GamesListComponent },
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
        path: 'admin',
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