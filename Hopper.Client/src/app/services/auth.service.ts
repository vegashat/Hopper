import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
    const token = localStorage.getItem('sessionToken');
    if (stored && token) {
      this.currentUserSubject.next(JSON.parse(stored) as Participant);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
    }
  }

  login(participant: Participant, pin: string): Observable<{ success: boolean; token: string }> {

    const claim = { firebaseUserId: participant.firebaseUserId, pin };

    return this.http.post<{ success: boolean; token: string }>(`${this.apiUrl}/claim`, claim)
      .pipe(tap(res => {
        if (res.success) {
          localStorage.setItem('user', JSON.stringify(participant));
          localStorage.setItem('sessionToken', res.token);
          this.currentUserSubject.next(participant);
        }
      }));
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    this.currentUserSubject.next(null);
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }
}
