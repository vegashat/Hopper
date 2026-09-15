// src/app/services/history.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./signalr.service";
import * as i3 from "./season.service";
export class HistoryService {
    http;
    signalR;
    seasonService;
    apiUrl = `${environment.apiUrl}/draft`;
    historySubject = new BehaviorSubject([]);
    history$ = this.historySubject.asObservable();
    constructor(http, signalR, seasonService) {
        this.http = http;
        this.signalR = signalR;
        this.seasonService = seasonService;
        this.getHistory(this.seasonService.currentSeasonId);
        this.signalR.on('SelectionMade', () => {
            this.getHistory(this.seasonService.currentSeasonId);
        });
    }
    getHistory(seasonId) {
        this.http.get(`${this.apiUrl}/${seasonId}/history`)
            .pipe(tap(history => {
            history = history.sort((a, b) => new Date(b.claimedUtc).getTime() - new Date(a.claimedUtc).getTime());
            return this.historySubject.next(history);
        }))
            .subscribe();
    }
    static ɵfac = function HistoryService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HistoryService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalRService), i0.ɵɵinject(i3.SeasonService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: HistoryService, factory: HistoryService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HistoryService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.HttpClient }, { type: i2.SignalRService }, { type: i3.SeasonService }], null); })();
