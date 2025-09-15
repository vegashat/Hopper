// src/app/services/participants.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Participant } from '@models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private apiUrl = 'http://localhost:5154/api/Participants';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Participant[]> {
    return this.http.get<Participant[]>(this.apiUrl);
  }

  getById(firebaseUserId: string): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/${firebaseUserId}`);
  }
}