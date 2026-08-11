import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { IncidentSource, IncidentSeverity, IncidentStatus } from '../entities/incident.entity';

export class CreateIncidentDto {
  @IsNotEmpty()
  title: string;

  @IsEnum(IncidentSource)
  source: IncidentSource;

  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @IsOptional()
  description?: string;

  @IsOptional()
  relatedJobName?: string;
}