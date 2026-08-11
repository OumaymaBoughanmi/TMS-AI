import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum IncidentSource {
  JOB = 'JOB',
  DATABASE = 'DATABASE',
  SERVER = 'SERVER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}


export interface Incident {
  id?: number;
  title: string;
  source: IncidentSource;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description?: string;
  probableCause?: string;
  aiSuggestion?: string;
  relatedJobName?: string;
  escalated?: boolean;
  escalatedAt?: string;
  createdAt?: string;
  resolvedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private apiUrl = 'http://localhost:3000/incidents';

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  updateStatus(id: number, status: IncidentStatus): Observable<Incident> {
    return this.http.patch<Incident>(`${this.apiUrl}/${id}`, { status });
  }


  getRelatedLogs(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/logs`);
  }
}