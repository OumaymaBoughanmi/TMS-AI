import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum CheckType {
  DATABASE = 'DATABASE',
  SERVER = 'SERVER',
}

export enum CheckStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface InfrastructureCheck {
  id?: number;
  name: string;
  type: CheckType;
  status: CheckStatus;
  errorMessage?: string;
  checkedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {
  private apiUrl = 'http://localhost:3000/infrastructure';

  constructor(private http: HttpClient) {}

  getChecks(): Observable<InfrastructureCheck[]> {
    return this.http.get<InfrastructureCheck[]>(this.apiUrl);
  }
}