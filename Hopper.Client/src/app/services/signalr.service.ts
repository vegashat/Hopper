// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private apiUrl = `${environment.apiUrl}`.replace('/api','');
  private hubConnection?: signalR.HubConnection;
  private seasonId?: number;
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

    this.hubConnection.onreconnected(() => this.joinSeason());

    this.hubConnection
      .start()
      .then(() => this.joinSeason())
      .catch(error => console.error('Unable to connect to draft updates.', error));
  }

  on<T>(event: string, handler: (data: T) => void): void {
    const wrapped = handler as (data: unknown) => void;
    const handlers = this.handlers.get(event) ?? [];
    handlers.push(wrapped);
    this.handlers.set(event, handlers);
    this.hubConnection?.on(event, wrapped);
  }

  private joinSeason(): Promise<void> {
    if (!this.hubConnection || this.seasonId === undefined) return Promise.resolve();
    return this.hubConnection.invoke('JoinSeason', this.seasonId.toString());
  }
}
