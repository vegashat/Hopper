import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameFilters } from '@models/game-filters.model';

export interface GameFilterState {
  searchTerm: string;
  showAvailableOnly: boolean;
  filters: GameFilters | null;
}

@Injectable({ providedIn: 'root' })
export class FilterService {
  private readonly _filterState = new BehaviorSubject<GameFilterState>({
    searchTerm: '',
    showAvailableOnly: false,
    filters: null,
  });

  filterState$ = this._filterState.asObservable();

  setSearchTerm(term: string) {
    const state = this._filterState.value;
    this._filterState.next({ ...state, searchTerm: term });
  }

  toggleAvailable() {
    const state = this._filterState.value;
    this._filterState.next({
      ...state,
      showAvailableOnly: !state.showAvailableOnly,
    });
  }

  setFilters(filters: GameFilters | null) {
    const state = this._filterState.value;
    this._filterState.next({ ...state, filters });
  }
}