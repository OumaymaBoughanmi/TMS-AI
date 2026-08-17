import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident, IncidentStatus, IncidentSeverity } from './entities/incident.entity';
import { Infrastructure, CheckType, CheckStatus } from '../infrastructure/entities/infrastructure.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EscalationLogsService } from '../escalation-logs/escalation-logs.service';
import { AiService } from '../ai/ai.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    @InjectRepository(Infrastructure)
    private infraRepository: Repository<Infrastructure>,
    private notificationsService: NotificationsService,
    private escalationLogsService: EscalationLogsService,
    private aiService: AiService,
    private logsService: LogsService,
  ) {}

  create(createIncidentDto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(createIncidentDto);
    return this.incidentRepository.save(incident);
  }

  findAll() {
    return this.incidentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.incidentRepository.findOneBy({ id });
  }

  async getRelatedLogs(id: number) {
    const incident = await this.incidentRepository.findOneBy({ id });
    if (!incident) {
      return [];
    }

    return this.logsService.findRelatedToIncident(
      incident.createdAt,
      incident.source,
      incident.relatedJobName,
    );
  }

  async update(id: number, updateIncidentDto: UpdateIncidentDto) {
    const updateData: any = { ...updateIncidentDto };

    if (updateIncidentDto.status === IncidentStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
    }

    await this.incidentRepository.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.incidentRepository.delete(id);
  }

  async createIfNotExists(data: {
    title: string;
    source: any;
    description?: string;
    relatedJobName?: string;
    severity?: any;
  }) {
    const existing = await this.incidentRepository.findOne({
      where: {
        title: data.title,
        status: IncidentStatus.OPEN,
      },
    });

    if (existing) {
      return existing;
    }

    const probableCause = await this.diagnoseCause(data.source, data.description);

    const aiSuggestion = await this.aiService.diagnoseWithAI({
      title: data.title,
      source: data.source,
      description: data.description,
    });

    const aiSeverityRaw = await this.aiService.classifySeverity({
      title: data.title,
      source: data.source,
      description: data.description,
    });

    const aiSeverity = IncidentSeverity[aiSeverityRaw as keyof typeof IncidentSeverity];

    // Re-check right before saving, in case another cron cycle created one while AI was thinking
    const stillNotExists = await this.incidentRepository.findOne({
      where: { title: data.title, status: IncidentStatus.OPEN },
    });

    if (stillNotExists) {
      return stillNotExists;
    }

    const incident = this.incidentRepository.create({
      ...data,
      severity: aiSeverity,
      probableCause,
      aiSuggestion,
    });
    const savedIncident = await this.incidentRepository.save(incident);

    await this.notificationsService.sendIncidentAlert({
      title: savedIncident.title,
      severity: savedIncident.severity,
      source: savedIncident.source,
      probableCause: savedIncident.probableCause,
      description: savedIncident.description,
    });

    return savedIncident;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkForEscalations() {
    const ESCALATION_THRESHOLD_MINUTES = 30;

    const openIncidents = await this.incidentRepository.find({
      where: { status: IncidentStatus.OPEN, escalated: false },
    });

    for (const incident of openIncidents) {
      const minutesOpen = (Date.now() - new Date(incident.createdAt).getTime()) / 1000 / 60;

      if (minutesOpen >= ESCALATION_THRESHOLD_MINUTES) {
        incident.escalated = true;
        incident.escalatedAt = new Date();
        await this.incidentRepository.save(incident);

        await this.notificationsService.sendEscalationAlert({
          title: incident.title,
          severity: incident.severity,
          minutesOpen: Math.round(minutesOpen),
        });

        await this.escalationLogsService.create({
          incidentId: incident.id,
          incidentTitle: incident.title,
          severity: incident.severity,
          minutesOpen: Math.round(minutesOpen),
        });
      }
    }
  }

  private async diagnoseCause(source: any, errorMessage?: string): Promise<string> {
    if (source === 'DATABASE') {
      return 'Database is unreachable — direct database connectivity failure';
    }

    if (source === 'SERVER') {
      return 'Server is unreachable — direct server connectivity failure';
    }

    if (!errorMessage) {
      return 'Unknown — no error message provided';
    }

    const msg = errorMessage.toLowerCase();
    const looksLikeConnectivityIssue = msg.includes('timeout') || msg.includes('connection');

    if (!looksLikeConnectivityIssue) {
      return 'Likely a job/business logic issue (check job configuration or data)';
    }

    const latestDbCheck = await this.infraRepository.findOne({
      where: { type: CheckType.DATABASE },
      order: { checkedAt: 'DESC' },
    });

    if (latestDbCheck?.status === CheckStatus.DOWN) {
      return 'Likely a database issue — database was DOWN at last check';
    }

    const latestServerCheck = await this.infraRepository.findOne({
      where: { type: CheckType.SERVER },
      order: { checkedAt: 'DESC' },
    });

    if (latestServerCheck?.status === CheckStatus.DOWN) {
      return 'Likely a server issue — server was DOWN at last check';
    }

    return 'Likely a network issue — connectivity error, but database and server both appear UP';
  }
}