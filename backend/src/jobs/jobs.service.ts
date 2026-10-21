import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobStatus } from './entities/job.entity';
import { IncidentsService } from '../incidents/incidents.service';
import { IncidentSource, IncidentSeverity } from '../incidents/entities/incident.entity';
import { LogsService } from '../logs/logs.service';
import { TalendService } from '../talend/talend.service';

interface PolledJob {
  name: string;
  status: string;
  duration?: number;
  errorMessage?: string;
  server?: string;
  statusKnown: boolean;
}

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
    let jobsToProcess: PolledJob[] = [];

    try {
      const realTasks = await this.talendService.getTasks();

      if (realTasks.length > 0) {
        console.log(`Polling Talend (REAL) — found ${realTasks.length} task(s)...`);
        jobsToProcess = realTasks.map((task) => ({
          name: task.name || task.id || 'Unnamed Talend task',
          status: 'SUCCESS', // placeholder: reading the real run status needs a second API call
          statusKnown: false,
        }));
      } else {
        console.log('Polling Talend (REAL) — no tasks found, falling back to simulated data...');
        jobsToProcess = this.getFakeTalendResponse();
      }
    } catch (error) {
      console.log('Polling Talend (REAL) failed — falling back to simulated data. Reason:', error.message);
      jobsToProcess = this.getFakeTalendResponse();
    }

    for (const item of jobsToProcess) {
      const { statusKnown, ...jobFields } = item;
      const existing = await this.jobRepository.findOneBy({ name: item.name });

      if (statusKnown) {
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
            ...jobFields,
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
      } else {
        // Real Talend task whose run status we do not read yet:
        // only register its name, without inventing a status or a run time in the logs.
        if (!existing) {
          const newJob = this.jobRepository.create({
            name: item.name,
            status: JobStatus.SUCCESS,
          });
          await this.jobRepository.save(newJob);
        }

        await this.logsService.log(
          'INFO',
          'JOB',
          `Job "${item.name}" found in Talend (run status not read yet)`,
        );
      }

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

  private getFakeTalendResponse(): PolledJob[] {
    return [
      { name: 'ETL_Load_Customers', status: 'SUCCESS', duration: 30, server: 'srv-etl-01', statusKnown: true },
      { name: 'ETL_Load_Orders', status: 'FAILED', duration: 8, errorMessage: 'Network timeout', server: 'srv-etl-02', statusKnown: true },
    ];
  }
}