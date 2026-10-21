import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TalendConfig {
  id?: number;
  apiUrl: string;
  apiToken: string;
  isActive?: boolean;
  updatedAt?: string;
}

export interface TestResult {
  ok: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TalendConfigService {
  private apiUrl = 'http://localhost:3000/talend-config';

  constructor(private http: HttpClient) {}

  getConfig(): Observable<TalendConfig> {
    return this.http.get<TalendConfig>(this.apiUrl);
  }

  saveConfig(config: { apiUrl: string; apiToken: string }): Observable<TalendConfig> {
    return this.http.post<TalendConfig>(this.apiUrl, config);
  }

  testConnection(config: { apiUrl: string; apiToken: string }): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.apiUrl}/test`, config);
  }
}