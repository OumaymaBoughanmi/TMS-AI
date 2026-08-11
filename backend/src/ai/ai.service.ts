import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private ollamaUrl = 'http://localhost:11434/api/generate';

  async diagnoseWithAI(incident: {
    title: string;
    source: string;
    description?: string;
  }): Promise<string> {
    const sourceContext = this.getSourceContext(incident.source);

    const prompt = `You are an IT monitoring assistant for a bank's Talend ETL monitoring system.

STRICT CONTEXT — only reason about what is stated below, do not invent unrelated systems:
- Incident type: ${incident.source} (${sourceContext})
- Title: ${incident.title}
- Error message: ${incident.description || 'No error message provided'}

Rules:
- If the incident type is SERVER, only discuss server/network reachability — do NOT mention databases or SQL unless the error message explicitly mentions them.
- If the incident type is DATABASE, only discuss database connectivity — do NOT mention unrelated servers.
- If the incident type is JOB, discuss the job's likely cause based only on the error message given.
- Do not invent specific log file names, table names, or system names that were not mentioned above.

In 2-3 short sentences, explain the likely cause and suggest one concrete, generic action to investigate it further. Be concise and stay strictly within the given context.`;

    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt,
          stream: false,
          options: {
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error('AI diagnosis failed:', error.message);
      return 'AI diagnosis unavailable — check Ollama is running.';
    }
  }

  private getSourceContext(source: string): string {
    switch (source) {
      case 'SERVER':
        return 'a direct server/network reachability check failed';
      case 'DATABASE':
        return 'a direct database connectivity check failed';
      case 'JOB':
        return 'a Talend ETL job execution failed';
      default:
        return 'an unspecified monitoring check failed';
    }
  }
}