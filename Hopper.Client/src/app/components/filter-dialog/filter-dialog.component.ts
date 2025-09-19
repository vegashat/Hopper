import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { GameFilters } from '@models/game-filters.model';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
  ]
})
export class FilterDialogComponent {
  months = [
    { num: 10, label: 'Oct' },
    { num: 11, label: 'Nov' },
    { num: 12, label: 'Dec' },
    { num: 1, label: 'Jan' },
    { num: 2, label: 'Feb' },
    { num: 3, label: 'Mar' },
    { num: 4, label: 'Apr' },
  ];

  daysOfWeek = [
    { num: 0, label: 'Sun' },
    { num: 1, label: 'Mon' },
    { num: 2, label: 'Tue' },
    { num: 3, label: 'Wed' },
    { num: 4, label: 'Thu' },
    { num: 5, label: 'Fri' },
    { num: 6, label: 'Sat' },
  ];

  selectedMonths: number[] = [];
  selectedDays: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filters: GameFilters | null }
  ) {
    if (data.filters) {
      this.selectedMonths = [...(data.filters.months || [])];
      this.selectedDays = [...(data.filters.daysOfWeek || [])];
    }
  }

  apply() {
    this.dialogRef.close({ months: this.selectedMonths, daysOfWeek: this.selectedDays });
  }

  clear() {
    this.selectedMonths = [];
    this.selectedDays = [];
    this.dialogRef.close({ months: [], daysOfWeek: [] });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}