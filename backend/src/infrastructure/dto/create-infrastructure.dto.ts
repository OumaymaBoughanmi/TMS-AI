import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CheckType, CheckStatus } from '../entities/infrastructure.entity';

export class CreateInfrastructureDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(CheckType)
  type: CheckType;

  @IsEnum(CheckStatus)
  status: CheckStatus;

  @IsOptional()
  errorMessage?: string;
}