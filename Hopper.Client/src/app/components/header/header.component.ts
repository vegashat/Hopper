import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';

import { DraftService } from '@services/draft.service';
import { DraftStatus } from '@models/draft.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;
  @Output() menuToggle = new EventEmitter<void>();

  seasonId = 1;
  status: DraftStatus | null = null;

  constructor(private draftService: DraftService) { }

  ngOnInit(): void {
    this.loadStatus();
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  loadStatus(): void {
    this.draftService.getDraftStatus(this.seasonId).subscribe({
      next: (status) => (this.status = status),
      error: (err) => console.error('Failed to load draft status in header', err),
    });
  }
  get currentPick(): string {
    // The "current" pick should be the first in upcoming
    return this.status?.upcoming?.[0]?.displayName ?? 'N/A';
  }

  get nextPick(): string {
    // The "next" pick is the second in upcoming
    return this.status?.upcoming?.[1]?.displayName ?? 'N/A';
  }
}