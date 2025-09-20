import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FilterService } from '@services/filter.service';
import { MatIconModule } from "@angular/material/icon";

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
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
]
})
export class FilterDialogComponent implements OnInit {
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

  searchTerm = '';
  selectedMonths: number[] = [];
  selectedDays: number[] = [];
  showAvailableOnly = false;

  constructor(
    private filterSvc: FilterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.filterSvc.filterState$.subscribe(state => {
      this.searchTerm = state.searchTerm;
      this.selectedMonths = state.filters?.months ?? [];
      this.selectedDays = state.filters?.daysOfWeek ?? [];
      this.showAvailableOnly = state.showAvailableOnly;
    });
  }

  onSearchChange(term: string) {
    this.filterSvc.setSearchTerm(term);
  }

  toggleAvailable() {
    this.filterSvc.toggleAvailable();
  }

  updateMonths(months: number[]) {
    this.filterSvc.setFilters({ months, daysOfWeek: this.selectedDays });
  }

  updateDays(days: number[]) {
    this.filterSvc.setFilters({ months: this.selectedMonths, daysOfWeek: days });
  }

  clear() {
    this.searchTerm = '';
    this.selectedMonths = [];
    this.selectedDays = [];
    this.showAvailableOnly = false;
    this.filterSvc.setSearchTerm('');
    this.filterSvc.setFilters({ months: [], daysOfWeek: [] });
  }
}