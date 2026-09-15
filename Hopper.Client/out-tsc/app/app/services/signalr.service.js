// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';
import * as i0 from "@angular/core";
export class SignalRService {
    apiUrl = `${environment.apiUrl}`.replace('/api', '');
    hubConnection;
    seasonId;
    handlers = new Map();
    connect(seasonId) {
        if (this.hubConnection)
            return;
        this.seasonId = seasonId;
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.apiUrl}/draftHub`)
            .withAutomaticReconnect()
            .build();
        for (const [event, handlers] of this.handlers) {
            handlers.forEach(handler => this.hubConnection?.on(event, handler));
        }
        this.hubConnection.onreconnected(() => this.joinSeason());
        this.hubConnection
            .start()
            .then(() => this.joinSeason())
            .catch(error => console.error('Unable to connect to draft updates.', error));
    }
    on(event, handler) {
        const wrapped = handler;
        const handlers = this.handlers.get(event) ?? [];
        handlers.push(wrapped);
        this.handlers.set(event, handlers);
        this.hubConnection?.on(event, wrapped);
    }
    joinSeason() {
        if (!this.hubConnection || this.seasonId === undefined)
            return Promise.resolve();
        return this.hubConnection.invoke('JoinSeason', this.seasonId.toString());
    }
    static ɵfac = function SignalRService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SignalRService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: SignalRService, factory: SignalRService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SignalRService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
