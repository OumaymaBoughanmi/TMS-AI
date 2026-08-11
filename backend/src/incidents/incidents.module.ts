import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { Incident } from './entities/incident.entity';
import { Infrastructure } from '../infrastructure/entities/infrastructure.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { EscalationLogsModule } from '../escalation-logs/escalation-logs.module';
import { AiModule } from '../ai/ai.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, Infrastructure]),
    NotificationsModule,
    EscalationLogsModule,
    AiModule,
    LogsModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}