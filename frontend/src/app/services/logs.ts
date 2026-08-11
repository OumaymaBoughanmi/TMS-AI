import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Log {
  id: number;
  level: string;
  source: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private apiUrl = 'http://localhost:3000/logs';

  constructor(private http: HttpClient) {}

  getLogs(search?: string): Observable<Log[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Log[]>(url);
  }
}