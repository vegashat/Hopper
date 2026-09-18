// src/app/services/signalr.service.ts
import { Injectable, NgZone, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private readonly zone = inject(NgZone);
  private apiUrl = `${environment.apiUrl}`.replace('/api','');
  private hubConnection?: signalR.HubConnection;
  private seasonId?: number;
  private startLoop?: Promise<void>;
  private readonly handlers = new Map<string, Array<(data: unknown) => void>>();

  connect(seasonId: number): void {
    if (this.hubConnection) return;
    this.seasonId = seasonId;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/draftHub`)
      .withAutomaticReconnect()
      .build();

    for (const [event, handlers] of this.handlers) {
      handlers.forEach(handler => this.hubConnection?.on(event, handler));
    }

    this.hubConnection.onreconnected(() => this.joinSeason().catch(error => {
      console.error('Unable to rejoin draft updates.', error);
      void this.startWithRetry();
    }));
    this.hubConnection.onclose(error => {
      if (error) console.error('Draft updates connection closed.', error);
      void this.startWithRetry();
    });

    void this.startWithRetry();
  }

  on<T>(event: string, handler: (data: T) => void): void {
    const wrapped = (data: unknown) => this.zone.run(() => handler(data as T));
    const handlers = this.handlers.get(event) ?? [];
    handlers.push(wrapped);
    this.handlers.set(event, handlers);
    this.hubConnection?.on(event, wrapped);
  }

  private joinSeason(): Promise<void> {
    if (!this.hubConnection || this.seasonId === undefined) return Promise.resolve();
    return this.hubConnection.invoke('JoinSeason', this.seasonId.toString());
  }

  private startWithRetry(): Promise<void> {
    if (this.startLoop) return this.startLoop;
    this.startLoop = (async () => {
      let retry = 0;
      while (this.hubConnection) {
        try {
          if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
            await this.hubConnection.start();
          }
          if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            await this.joinSeason();
            return;
          }
        } catch (error) {
          console.error('Unable to connect to draft updates; retrying.', error);
        }

        const delayMs = Math.min(1000 * 2 ** retry, 15000);
        retry++;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    })().finally(() => this.startLoop = undefined);
    return this.startLoop;
  }
}
