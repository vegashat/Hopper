import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./signalr.service";
import * as i3 from "./toast.service";
import * as i4 from "./season.service";
export class DraftService {
    http;
    signalR;
    toastService;
    seasonService;
    apiUrl = `${environment.apiUrl}/Draft`;
    draftStatusSubject = new BehaviorSubject(null);
    draftStatus$ = this.draftStatusSubject.asObservable();
    constructor(http, signalR, toastService, seasonService) {
        this.http = http;
        this.signalR = signalR;
        this.toastService = toastService;
        this.seasonService = seasonService;
        this.loadStatus(this.seasonService.currentSeasonId);
        this.signalR.connect(this.seasonService.currentSeasonId);
        // --- SignalR events ---
        this.signalR.on('DraftStarted', status => {
            this.draftStatusSubject.next(status);
            this.toastService.info('✅ Draft has started!');
        });
        this.signalR.on('DraftReset', status => {
            this.draftStatusSubject.next(status);
            this.toastService.info('♻️ Draft has been reset');
        });
        this.signalR.on('StatusChanged', status => {
            this.draftStatusSubject.next(status);
        });
        this.signalR.on('SelectionMade', payload => {
            const selection = payload.selections[0];
            const game = payload.game;
            if (!selection)
                return;
            const user = selection.displayName || selection.firebaseUserId;
            const opponent = game?.opponent.name ?? 'Unknown Opponent';
            const qty = payload.selections.reduce((total, item) => total + item.quantity, 0);
            this.toastService.info(`🎟️ ${user} picked ${qty} tickets for ${opponent}`);
        });
    }
    loadStatus(seasonId) {
        return this.http
            .get(`${this.apiUrl}/${seasonId}/status`)
            .pipe(tap(status => this.draftStatusSubject.next(status)))
            .subscribe({ error: () => this.toastService.error('Unable to load draft status') });
    }
    updateAllotment(seasonId, userId, allotment) {
        return this.http.put(`${this.apiUrl}/${seasonId}/allotments/${encodeURIComponent(userId)}`, { allotment })
            .pipe(tap(status => this.draftStatusSubject.next(status)));
    }
    startDraft(seasonId) {
        return this.http.post(`${this.apiUrl}/start/${seasonId}`, {});
    }
    resetDraft(seasonId) {
        return this.http.post(`${this.apiUrl}/reset/${seasonId}`, {});
    }
    static ɵfac = function DraftService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DraftService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalRService), i0.ɵɵinject(i3.ToastService), i0.ɵɵinject(i4.SeasonService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DraftService, factory: DraftService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DraftService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], () => [{ type: i1.HttpClient }, { type: i2.SignalRService }, { type: i3.ToastService }, { type: i4.SeasonService }], null); })();
