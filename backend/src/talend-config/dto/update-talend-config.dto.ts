import { PartialType } from '@nestjs/mapped-types';
import { CreateTalendConfigDto } from './create-talend-config.dto';

export class UpdateTalendConfigDto extends PartialType(CreateTalendConfigDto) {}
