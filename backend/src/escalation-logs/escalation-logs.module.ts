import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscalationLogsService } from './escalation-logs.service';
import { EscalationLogsController } from './escalation-logs.controller';
import { EscalationLog } from './entities/escalation-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EscalationLog])],
  controllers: [EscalationLogsController],
  providers: [EscalationLogsService],
  exports: [EscalationLogsService],
})
export class EscalationLogsModule {}