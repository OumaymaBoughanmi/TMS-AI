import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructureService } from './infrastructure.service';
import { InfrastructureController } from './infrastructure.controller';
import { Infrastructure } from './entities/infrastructure.entity';
import { IncidentsModule } from '../incidents/incidents.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Infrastructure]), IncidentsModule, LogsModule],
  controllers: [InfrastructureController],
  providers: [InfrastructureService],
  exports: [InfrastructureService],
})
export class InfrastructureModule {}