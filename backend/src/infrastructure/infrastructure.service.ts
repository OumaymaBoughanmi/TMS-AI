import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { Infrastructure, CheckType, CheckStatus } from './entities/infrastructure.entity';
import { IncidentsService } from '../incidents/incidents.service';
import { IncidentSource, IncidentSeverity } from '../incidents/entities/incident.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class InfrastructureService {
constructor(
    @InjectRepository(Infrastructure)
    private infraRepository: Repository<Infrastructure>,
    private dataSource: DataSource,
    private incidentsService: IncidentsService,
    private logsService: LogsService,
  ) {}

  create(createInfrastructureDto: CreateInfrastructureDto) {
    const check = this.infraRepository.create(createInfrastructureDto);
    return this.infraRepository.save(check);
  }

  findAll() {
    return this.infraRepository.find({
      order: { checkedAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.infraRepository.findOneBy({ id });
  }

  update(id: number, updateInfrastructureDto: UpdateInfrastructureDto) {
    return this.infraRepository.update(id, updateInfrastructureDto);
  }

  remove(id: number) {
    return this.infraRepository.delete(id);
  }

  // ===== Health checks =====

  // Check 1: Is the database reachable?
  async checkDatabase(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
      await this.saveCheckResult('PostgreSQL Database', CheckType.DATABASE, CheckStatus.UP);
    } catch (error) {
      await this.saveCheckResult(
        'PostgreSQL Database',
        CheckType.DATABASE,
        CheckStatus.DOWN,
        error.message,
      );
    }
  }

  // Check 2: Is a given server reachable? (basic HTTP ping)
  async checkServer(name: string, url: string): Promise<void> {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok || response.status < 500) {
        await this.saveCheckResult(name, CheckType.SERVER, CheckStatus.UP);
      } else {
        await this.saveCheckResult(
          name,
          CheckType.SERVER,
          CheckStatus.DOWN,
          `HTTP ${response.status}`,
        );
      }
    } catch (error) {
      await this.saveCheckResult(name, CheckType.SERVER, CheckStatus.DOWN, error.message);
    }
  }

  private async saveCheckResult(
    name: string,
    type: CheckType,
    status: CheckStatus,
    errorMessage?: string,
  ) {
    const check = this.infraRepository.create({ name, type, status, errorMessage });
    await this.infraRepository.save(check);

        await this.logsService.log(
      status === CheckStatus.DOWN ? 'ERROR' : 'INFO',
      type === CheckType.DATABASE ? 'DATABASE' : 'SERVER',
      `${name} check reported status ${status}${errorMessage ? ' — ' + errorMessage : ''}`,
    );

    if (status === CheckStatus.DOWN) {
      await this.incidentsService.createIfNotExists({
        title: `${type === CheckType.DATABASE ? 'Database' : 'Server'} down: ${name}`,
        source: type === CheckType.DATABASE ? IncidentSource.DATABASE : IncidentSource.SERVER,
        severity: IncidentSeverity.CRITICAL,
        description: errorMessage,
      });
    }
  }

  // ===== Runs automatically every minute =====
  @Cron(CronExpression.EVERY_MINUTE)
  async runHealthChecks() {
    console.log('Running infrastructure health checks...');
    await this.checkDatabase();
    // Example server check — replace with a real server URL later
    await this.checkServer('srv-etl-01', 'https://www.google.com');
    //await this.checkServer('srv-etl-01', 'https://this-does-not-exist-12345.com');
  }
}

