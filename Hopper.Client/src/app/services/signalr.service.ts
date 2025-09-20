// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private apiUrl = `${environment.apiUrl}`.replace('/api','');
  private hubConnection!: signalR.HubConnection;

  connect(seasonId: number) {
    if (this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/drafthub?seasonId=${seasonId}`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected (DraftService)');
        // 👇 Tell server we want to join the season group
        this.hubConnection.invoke('JoinSeason', seasonId.toString())
          .then(() => console.log(`Joined season group ${seasonId}`))
          .catch(err => console.error('Error joining season group:', err));
      })
      .catch(err => console.error('SignalR error (DraftService):', err));
  }

  on<T>(event: string, handler: (data: T) => void) {
    this.hubConnection.on(event, handler);
  }
}