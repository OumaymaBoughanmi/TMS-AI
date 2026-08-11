import { PartialType } from '@nestjs/mapped-types';
import { CreateEscalationLogDto } from './create-escalation-log.dto';

export class UpdateEscalationLogDto extends PartialType(CreateEscalationLogDto) {}
