import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EscalationLog {
  id: number;
  incidentId: number;
  incidentTitle: string;
  severity: string;
  minutesOpen: number;
  escalatedTo: string;
  escalatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class EscalationLogsService {
  private apiUrl = 'http://localhost:3000/escalation-logs';

  constructor(private http: HttpClient) {}

  getLogs(): Observable<EscalationLog[]> {
    return this.http.get<EscalationLog[]>(this.apiUrl);
  }
}