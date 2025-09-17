import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatButtonToggleModule
  ],
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent {
  months = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  selectedDays: string[] = [];
  selectedMonths: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedMonths = (data?.months || []).map((m: number) =>
      this.numToMonth(m)
    );
    this.selectedDays = (data?.daysOfWeek || []).map((d: number) =>
      this.days[d]
    );
  }

  apply() {
    this.dialogRef.close({
      months: this.selectedMonths.map(m => this.labelToMonth(m)),
      daysOfWeek: this.selectedDays.map(d => this.days.indexOf(d)),
    });
  }

  clearFilters() {
    this.selectedMonths = [];
    this.selectedDays = [];
    // immediately apply clear
    this.dialogRef.close({ months: [], daysOfWeek: [] });
  }

  private labelToMonth(label: string): number {
    const map: Record<string, number> = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4,
      May: 5, Jun: 6, Jul: 7, Aug: 8,
      Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };
    return map[label];
  }

  private numToMonth(num: number): string {
    const map: Record<number, string> = {
      1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
      5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug',
      9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
    };
    return map[num];
  }
}