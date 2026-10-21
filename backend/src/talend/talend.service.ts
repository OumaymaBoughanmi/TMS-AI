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
    const data: any = await response.json();
    // Talend wraps the list in an "items" field: { items: [...], total: N }
    return Array.isArray(data) ? data : (data.items ?? []);
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

  // Audit logs live at the host root (/security/audit/logs), not under /tmc/v2.6
  async getAuditLogs(): Promise<any> {
    const { headers, baseUrl } = await this.getHeaders();
    const host = new URL(baseUrl).origin;
    const url = `${host}/security/audit/logs`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Talend audit logs API error: ${response.status} on ${url} — ${body}`);
    }
    return response.json();
  }
}