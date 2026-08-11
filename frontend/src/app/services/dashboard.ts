import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalJobs: number;
  successRate: number;
  openIncidents: number;
  mttrMinutes: number;
}

export interface IncidentsOverTimePoint {
  date: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats`);
  }

  getIncidentsOverTime(): Observable<IncidentsOverTimePoint[]> {
    return this.http.get<IncidentsOverTimePoint[]>(`${this.baseUrl}/incidents-over-time`);
  }
}