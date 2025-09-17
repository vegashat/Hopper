// src/app/services/snack-bar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'Close', config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      ...config
    });
  }
}