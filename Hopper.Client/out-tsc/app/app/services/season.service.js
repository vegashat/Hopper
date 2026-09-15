import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class SeasonService {
    currentSeasonId = 1;
    static ɵfac = function SeasonService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SeasonService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SeasonService, factory: SeasonService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SeasonService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
