import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Job } from '../jobs/entities/job.entity';
import { Incident } from '../incidents/entities/incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Incident])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}