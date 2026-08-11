import { IsEnum, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { JobStatus } from '../entities/job.entity';

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(JobStatus)
  status: JobStatus;

  @IsOptional()
  @IsDateString()
  lastRunAt?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  errorMessage?: string;

  @IsOptional()
  server?: string;
}