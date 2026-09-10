import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from '@services/auth.service';
import { SeasonService } from '@services/season.service';
import { Participant } from '@models/participant.model';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  participants: Participant[] = [];
  selectedUser: string | null = null;
  pin: string = '';
  loading = false;
  resetting = false;
  confirmPin = '';
  message: string | null = null;
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private http: HttpClient,
    private auth: AuthService,
    private season: SeasonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.http.get<Participant[]>(`${environment.apiUrl}/participants`, {
      params: { seasonId: this.season.currentSeasonId }
    }).subscribe({
      next: (users) => (this.participants = users),
      error: () => (this.error = 'Failed to load participants')
    });
  }

  beginReset(): void {
    this.resetting = true;
    this.pin = '';
    this.confirmPin = '';
    this.error = null;
    this.message = null;
  }

  resetPin(): void {
    if (!this.selectedUser || !this.pin || this.pin !== this.confirmPin) {
      this.error = 'Select a participant and enter matching new PINs.';
      return;
    }
    this.loading = true;
    this.http.post(`${environment.apiUrl}/participants/reset-pin`, {
      firebaseUserId: this.selectedUser, pin: this.pin
    }).subscribe({
      next: () => {
        const user = this.participants.find(p => p.firebaseUserId === this.selectedUser);
        if (user) user.pinResetUsed = true;
        this.loading = false;
        this.resetting = false;
        this.error = null;
        this.pin = '';
        this.confirmPin = '';
        this.message = 'PIN reset. Log in with your new PIN. Future resets require the administrator.';
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || 'Unable to reset PIN. Please ask the administrator.';
      }
    });
  }

  get resetUsed(): boolean {
    return !!this.participants.find(p => p.firebaseUserId === this.selectedUser)?.pinResetUsed;
  }

  login() {
    if (!this.selectedUser || !this.pin) {
      this.error = 'Please select a user and enter a PIN.';
      return;
    }
    var user = this.participants.filter(p => p.firebaseUserId == this.selectedUser)[0];

    this.loading = true;
    this.auth.login(user, this.pin).subscribe({
      next: (res : any) => {
        this.loading = false;
        if (res.success) {
          this.dialogRef.close(true);
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Login failed';
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}