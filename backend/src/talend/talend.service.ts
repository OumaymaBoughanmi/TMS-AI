import { Injectable } from '@nestjs/common';
import { TalendConfigService } from '../talend-config/talend-config.service';

export interface TalendTask {
  id: string;
  name: string;
}

export interface TalendExecution {
  id: string;
  executableId: string;
  status: string;
  startTimestamp?: number;
  endTimestamp?: number;
  errorMessage?: string;
}

@Injectable()
export class TalendService {
  constructor(private talendConfigService: TalendConfigService) {}

  private async getHeaders() {
    const config = await this.talendConfigService.getActiveConfig();
    if (!config) {
      throw new Error('Talend API is not configured yet. Please set it up in Settings.');
    }
    return {
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
      baseUrl: config.apiUrl,
    };
  }

  async getTasks(): Promise<TalendTask[]> {
    const { headers, baseUrl } = await this.getHeaders();
    const response = await fetch(`${baseUrl}/executables/tasks`, { headers });
    if (!response.ok) {
      throw new Error(`Talend API error: ${response.status}`);
    }
    return response.json();
  }

  async getExecutionStatus(executionId: string): Promise<TalendExecution> {
    const { headers, baseUrl } = await this.getHeaders();
    const response = await fetch(`${baseUrl}/executions/${executionId}`, { headers });
    if (!response.ok) {
      throw new Error(`Talend API error: ${response.status}`);
    }
    return response.json();
  }

  async runTask(taskId: string): Promise<TalendExecution> {
    const { headers, baseUrl } = await this.getHeaders();
    const response = await fetch(`${baseUrl}/executions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ executable: taskId }),
    });
    if (!response.ok) {
      throw new Error(`Talend API error: ${response.status}`);
    }
    return response.json();
  }
}