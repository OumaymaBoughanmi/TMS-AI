import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TalendTask {
  id: string;
  name: string;
}

export interface TalendExecution {
  id: string;
  executableId: string;
  status: string; // e.g. RUNNING, FINISHED, FAILED
  startTimestamp?: number;
  endTimestamp?: number;
  errorMessage?: string;
}

@Injectable()
export class TalendService {
  private baseUrl: string;
  private token: string;

  constructor(private configService: ConfigService) {
    // Example EU URL — change region if needed (US / EU / AP)
    this.baseUrl = this.configService.get('TALEND_API_URL') || '';
    this.token = this.configService.get('TALEND_API_TOKEN') || '';
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // 1. Get the list of tasks (jobs) defined in Talend
  async getTasks(): Promise<TalendTask[]> {
    const response = await fetch(`${this.baseUrl}/executables/tasks`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Talend API error: ${response.status}`);
    }
    return response.json();
  }

  // 2. Get the status of a specific execution
  async getExecutionStatus(executionId: string): Promise<TalendExecution> {
    const response = await fetch(`${this.baseUrl}/executions/${executionId}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`Talend API error: ${response.status}`);
    }
    return response.json();
  }

  // 3. Trigger a task execution
  async runTask(taskId: string): Promise<TalendExecution> {
    const response = await fetch(`${this.baseUrl}/executions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ executable: taskId }),
    });
    if (!response.ok) {
      throw new Error(`Talend API error: ${response.status}`);
    }
    return response.json();
  }
}