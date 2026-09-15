import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./signalr.service";
import * as i3 from "./toast.service";
import * as i4 from "./season.service";
export class GamesService {
    http;
    signalR;
    toastService;
    seasonService;
    gamesSubject = new BehaviorSubject([]);
    games$ = this.gamesSubject.asObservable();
    apiUrl = `${environment.apiUrl}/games`;
    constructor(http, signalR, toastService, seasonService) {
        this.http = http;
        this.signalR = signalR;
        this.toastService = toastService;
        this.seasonService = seasonService;
        this.loadSeasonGames(this.seasonService.currentSeasonId);
        this.signalR.connect(this.seasonService.currentSeasonId);
        // --- SignalR events ---
        this.signalR.on('SelectionMade', payload => {
            const updated = payload.game;
            if (updated) {
                this.updateGame(updated);
                if (updated.remainingTickets === 0) {
                    this.toastService.warning(`🚨 ${updated.opponent.name} on ${new Date(updated.gameDateTime).toLocaleDateString()} is now SOLD OUT!`);
                }
            }
        });
        this.signalR.on('DraftStarted', status => {
            this.loadSeasonGames(status.seasonId);
        });
    }
    loadSeasonGames(seasonId) {
        this.getSeasonGames(seasonId)
            .pipe(tap(games => this.gamesSubject.next(games)))
            .subscribe({ error: () => this.toastService.error('Unable to load games') });
    }
    getSeasonGames(seasonId) {
        return this.http.get(`${this.apiUrl}/season/${seasonId}`);
    }
    updateGame(updated) {
        const current = this.gamesSubject.getValue();
        const idx = current.findIndex(g => g.gameId == updated.gameId);
        if (idx > -1) {
            current[idx] = { ...updated };
            this.gamesSubject.next([...current]);
        }
    }
    static ɵfac = function GamesService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GamesService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.SignalRService), i0.ɵɵinject(i3.ToastService), i0.ɵɵinject(i4.SeasonService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: GamesService, factory: GamesService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GamesService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }, { type: i2.SignalRService }, { type: i3.ToastService }, { type: i4.SeasonService }], null); })();
