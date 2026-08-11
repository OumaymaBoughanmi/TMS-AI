import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum JobStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  RUNNING = 'RUNNING',
}

export interface Job {
  id?: number;
  name: string;
  status: JobStatus;
  lastRunAt?: string;
  duration?: number;
  errorMessage?: string;
  server?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private apiUrl = 'http://localhost:3000/jobs';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  createJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }
}