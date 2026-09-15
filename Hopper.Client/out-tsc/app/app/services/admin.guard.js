import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
export const adminGuard = () => {
    const auth = inject(AuthService);
    return auth.currentUser?.isAdmin ? true : inject(Router).createUrlTree(['/games']);
};
