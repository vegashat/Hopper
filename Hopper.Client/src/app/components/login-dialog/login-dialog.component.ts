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
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private http: HttpClient,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.http.get<Participant[]>(`${environment.apiUrl}/participants`).subscribe({
      next: (users) => (this.participants = users),
      error: () => (this.error = 'Failed to load participants')
    });
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