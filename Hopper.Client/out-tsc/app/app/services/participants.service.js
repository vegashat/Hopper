// src/app/services/participants.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ParticipantsService {
    http;
    apiUrl = `${environment.apiUrl}/Participants`;
    constructor(http) {
        this.http = http;
    }
    getAll() {
        return this.http.get(this.apiUrl);
    }
    getById(firebaseUserId) {
        return this.http.get(`${this.apiUrl}/${firebaseUserId}`);
    }
    static ɵfac = function ParticipantsService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ParticipantsService)(i0.ɵɵinject(i1.HttpClient)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ParticipantsService, factory: ParticipantsService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ParticipantsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.HttpClient }], null); })();
