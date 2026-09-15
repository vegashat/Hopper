import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./auth.service";
export class GameRankingsService {
    http;
    auth;
    constructor(http, auth) {
        this.http = http;
        this.auth = auth;
    }
    get(seasonId) {
        return this.http.get(`${environment.apiUrl}/seasons/${seasonId}/game-rankings`, { params: { firebaseUserId: this.currentUserId } });
    }
    replace(seasonId, rankings) {
        return this.http.put(`${environment.apiUrl}/seasons/${seasonId}/game-rankings`, rankings, { params: { firebaseUserId: this.currentUserId } });
    }
    get currentUserId() {
        const userId = this.auth.currentUser?.firebaseUserId;
        if (!userId)
            throw new Error('A logged-in participant is required for rankings.');
        return userId;
    }
    static ɵfac = function GameRankingsService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GameRankingsService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.AuthService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: GameRankingsService, factory: GameRankingsService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GameRankingsService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }, { type: i2.AuthService }], null); })();
