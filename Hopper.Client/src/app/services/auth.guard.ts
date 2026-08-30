import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '@components/login-dialog/login-dialog.component';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).currentUser) return true;

  return inject(MatDialog)
    .open(LoginDialogComponent, { width: '400px' })
    .afterClosed()
    .pipe(map(success => success === true));
};
