import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EscalationLog } from './entities/escalation-log.entity';

@Injectable()
export class EscalationLogsService {
  constructor(
    @InjectRepository(EscalationLog)
    private escalationLogRepository: Repository<EscalationLog>,
  ) {}

  findAll() {
    return this.escalationLogRepository.find({
      order: { escalatedAt: 'DESC' },
    });
  }

  create(data: {
    incidentId: number;
    incidentTitle: string;
    severity: string;
    minutesOpen?: number;
    escalatedTo?: string;
  }) {
    const log = this.escalationLogRepository.create(data);
    return this.escalationLogRepository.save(log);
  }
}