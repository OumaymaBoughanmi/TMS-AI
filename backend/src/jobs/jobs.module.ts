import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { IncidentsModule } from '../incidents/incidents.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), IncidentsModule, LogsModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}