import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ClaimRequest } from "@models/claim-request.model";
import { Participant } from "@models/participant.model";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/participants`;
  private currentUserSubject = new BehaviorSubject<Participant | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) {
      var user = JSON.parse(stored) as Participant;
      this.currentUserSubject.next(JSON.parse(stored) as Participant);
    }
  }

  login(participant : Participant, pin: string) : Observable<void> {

    let claim = {firebaseUserId: participant.firebaseUserId, pin: pin}

    return this.http.post<any>(`${this.apiUrl}/claim`, claim)
      .pipe(tap((res:any) => {
        if (res.success) {
          localStorage.setItem('user', JSON.stringify(participant));
          this.currentUserSubject.next(participant);
        }
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }
}