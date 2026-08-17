import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { Incident, IncidentStatus } from '../incidents/entities/incident.entity';
import { Infrastructure } from '../infrastructure/entities/infrastructure.entity';
import { User } from '../user/entities/user.entity';
import { Log } from '../logs/entities/log.entity';

@Injectable()
export class ChatbotService {
  private ollamaUrl = 'http://localhost:11434/api/generate';

  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(Incident) private incidentRepository: Repository<Incident>,
    @InjectRepository(Infrastructure) private infraRepository: Repository<Infrastructure>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Log) private logRepository: Repository<Log>,
  ) {}

  async ask(question: string): Promise<string> {
    const context = await this.buildContext();

    const prompt = `You are an IT assistant for BIAT bank's Talend Monitoring System (TMS-AI). You help staff understand what's happening in the system and answer general IT/monitoring questions.

CURRENT SYSTEM DATA (use this to answer data-related questions accurately):
${context}

Rules:
- If the question is about the system's live data (jobs, incidents, infrastructure, users), answer using ONLY the data above. Do not invent numbers or details not shown.
- If the data above doesn't contain what's needed to answer, say so honestly instead of guessing.
- If the question is general IT/monitoring knowledge (not about live data), answer helpfully using your general knowledge.
- Keep answers concise and professional, 2-4 sentences unless more detail is clearly needed.

User question: ${question}`;

    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt,
          stream: false,
          options: { temperature: 0.4 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error('Chatbot failed:', error.message);
      return "Sorry, I couldn't process that right now — please make sure the AI service is running.";
    }
  }

private async buildContext(): Promise<string> {
    const [jobs, incidents, infra, userCount, recentLogs] = await Promise.all([
      this.jobRepository.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.incidentRepository.find({ order: { createdAt: 'DESC' }, take: 5 }),
      this.infraRepository.find({ order: { checkedAt: 'DESC' }, take: 3 }),
      this.userRepository.count(),
      this.logRepository.find({ order: { timestamp: 'DESC' }, take: 5 }),
    ]);

    const openIncidents = incidents.filter((i) => i.status === IncidentStatus.OPEN);

    const jobsSummary = jobs
      .map((j) => `- ${j.name}: ${j.status}${j.errorMessage ? ' (' + j.errorMessage + ')' : ''}`)
      .join('\n');

    const incidentsSummary = incidents
      .map((i) => `- [${i.status}] ${i.title} — severity: ${i.severity}${i.escalated ? ' (escalated)' : ''}`)
      .join('\n');

    const infraSummary = infra
      .map((c) => `- ${c.name} (${c.type}): ${c.status}`)
      .join('\n');

    const logsSummary = recentLogs
      .map((l) => `- [${l.level}] ${l.message}`)
      .join('\n');

    return `
Total registered users: ${userCount}
Open incidents count: ${openIncidents.length}

Recent jobs (latest 10):
${jobsSummary || 'No jobs recorded.'}

Recent incidents (latest 10):
${incidentsSummary || 'No incidents recorded.'}

Latest infrastructure checks:
${infraSummary || 'No infrastructure checks recorded.'}

Recent system logs (latest 10):
${logsSummary || 'No logs recorded.'}
    `.trim();
  }
}