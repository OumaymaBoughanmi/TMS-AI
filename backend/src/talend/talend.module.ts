import { Module } from '@nestjs/common';
import { TalendService } from './talend.service';

@Module({
  providers: [TalendService],
  exports: [TalendService],
})
export class TalendModule {}