import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { IncidentsModule } from '../incidents/incidents.module';
import { LogsModule } from '../logs/logs.module';
import { TalendModule } from '../talend/talend.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), IncidentsModule, LogsModule, TalendModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}