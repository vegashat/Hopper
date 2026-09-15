import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class FilterService {
    _filterState = new BehaviorSubject({
        searchTerm: '',
        showAvailableOnly: false,
        filters: null,
    });
    filterState$ = this._filterState.asObservable();
    setSearchTerm(term) {
        const state = this._filterState.value;
        this._filterState.next({ ...state, searchTerm: term });
    }
    setAvailableOnly(value) {
        const state = this._filterState.value;
        this._filterState.next({ ...state, showAvailableOnly: value });
    }
    toggleAvailable() {
        const state = this._filterState.value;
        this._filterState.next({
            ...state,
            showAvailableOnly: !state.showAvailableOnly,
        });
    }
    setFilters(filters) {
        const state = this._filterState.value;
        this._filterState.next({ ...state, filters });
    }
    get currentState() {
        return this._filterState.value;
    }
    static ɵfac = function FilterService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FilterService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: FilterService, factory: FilterService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FilterService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
