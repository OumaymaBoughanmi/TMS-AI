import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from '../jobs/entities/job.entity';
import { Incident, IncidentStatus } from '../incidents/entities/incident.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}

  async getStats() {
    const allJobs = await this.jobRepository.find();
    const totalJobs = allJobs.length;
    const successJobs = allJobs.filter((j) => j.status === JobStatus.SUCCESS).length;
    const successRate = totalJobs > 0 ? Math.round((successJobs / totalJobs) * 100) : 0;

    const openIncidents = await this.incidentRepository.count({
      where: { status: IncidentStatus.OPEN },
    });

    const resolvedIncidents = await this.incidentRepository.find({
      where: { status: IncidentStatus.RESOLVED },
    });

    let mttrMinutes = 0;
    if (resolvedIncidents.length > 0) {
      const totalMinutes = resolvedIncidents.reduce((sum, incident) => {
        if (incident.resolvedAt && incident.createdAt) {
          const diffMs =
            new Date(incident.resolvedAt).getTime() - new Date(incident.createdAt).getTime();
          return sum + diffMs / 1000 / 60;
        }
        return sum;
      }, 0);
      mttrMinutes = Math.round(totalMinutes / resolvedIncidents.length);
    }

    return {
      totalJobs,
      successRate,
      openIncidents,
      mttrMinutes,
    };
  }

  async getIncidentsOverTime() {
    const allIncidents = await this.incidentRepository.find();

    const days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

      const count = allIncidents.filter((incident) => {
        const incidentDate = new Date(incident.createdAt).toISOString().split('T')[0];
        return incidentDate === dateStr;
      }).length;

      days.push({ date: dateStr, count });
    }

    return days;
  }
}