// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  connect(seasonId: number) {
    if (this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:5154/drafthub?seasonId=${seasonId}`)
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