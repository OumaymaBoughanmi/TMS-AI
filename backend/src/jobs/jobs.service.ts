import { IncidentsService } from '../incidents/incidents.service';
import { IncidentSource, IncidentSeverity } from '../incidents/entities/incident.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogsService } from '../logs/logs.service';
import { TalendService } from '../talend/talend.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private incidentsService: IncidentsService,
    private logsService: LogsService,
    private talendService: TalendService,
  ) {}
  create(createJobDto: CreateJobDto) {
    const job = this.jobRepository.create(createJobDto);
    return this.jobRepository.save(job);
  }

  findAll() {
    return this.jobRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.jobRepository.findOneBy({ id });
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    await this.jobRepository.update(id, updateJobDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.jobRepository.delete(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
   async pollTalend() {
    let jobsToProcess: { name: string; status: string; duration?: number; errorMessage?: string; server?: string }[] = [];

    try {
      // Try the real Talend API first
      const realTasks = await this.talendService.getTasks();

      if (realTasks && realTasks.length > 0) {
        console.log(`Polling Talend (REAL) — found ${realTasks.length} task(s)...`);
        // NOTE: real Talend tasks don't include status directly here — this is a simplified mapping
        jobsToProcess = realTasks.map((task) => ({
          name: task.name,
          status: 'SUCCESS', // simplified — real status would need a second call per task
        }));
      } else {
        console.log('Polling Talend (REAL) — no real tasks found, falling back to simulated data...');
        jobsToProcess = this.getFakeTalendResponse();
      }
    } catch (error) {
      console.log('Polling Talend (REAL) failed — falling back to simulated data. Reason:', error.message);
      jobsToProcess = this.getFakeTalendResponse();
    }

    for (const item of jobsToProcess) {
      const existing = await this.jobRepository.findOneBy({ name: item.name });

      if (existing) {
        await this.jobRepository.update(existing.id, {
          status: item.status as any,
          duration: item.duration,
          errorMessage: item.errorMessage || undefined,
          server: item.server,
          lastRunAt: new Date(),
        });
      } else {
        const newJob = this.jobRepository.create({
          ...item,
          status: item.status as any,
          lastRunAt: new Date(),
        });
        await this.jobRepository.save(newJob);
      }

      await this.logsService.log(
        item.status === 'FAILED' ? 'ERROR' : 'INFO',
        'JOB',
        `Job "${item.name}" reported status ${item.status}${item.errorMessage ? ' — ' + item.errorMessage : ''}`,
      );

      if (item.status === 'FAILED') {
        await this.incidentsService.createIfNotExists({
          title: `Job failed: ${item.name}`,
          source: IncidentSource.JOB,
          severity: IncidentSeverity.HIGH,
          description: item.errorMessage,
          relatedJobName: item.name,
        });
      }
    }
  }

  private getFakeTalendResponse() {
    return [
      { name: 'ETL_Load_Customers', status: 'SUCCESS', duration: 30, server: 'srv-etl-01' },
      { name: 'ETL_Load_Orders', status: 'FAILED', duration: 8, errorMessage: 'Network timeout', server: 'srv-etl-02' },
    ];
  }
}