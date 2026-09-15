// src/app/services/selections.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SelectionsService {
    http;
    baseUrl = `${environment.apiUrl}/Selections`;
    constructor(http) {
        this.http = http;
    }
    makeSelection(seasonId, selections, fulfilledRankingId) {
        const options = fulfilledRankingId
            ? { params: { fulfilledRankingId } }
            : {};
        return this.http.post(`${this.baseUrl}/${seasonId}`, selections, options);
    }
    deleteSelection(id) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
    getSelectionsByUser(firebaseUserId) {
        return this.http.get(`${this.baseUrl}/user/${firebaseUserId}`);
    }
    getSelectionsByGame(gameId) {
        return this.http.get(`${this.baseUrl}/game/${gameId}`);
    }
    static ɵfac = function SelectionsService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SelectionsService)(i0.ɵɵinject(i1.HttpClient)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SelectionsService, factory: SelectionsService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SelectionsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], () => [{ type: i1.HttpClient }], null); })();
