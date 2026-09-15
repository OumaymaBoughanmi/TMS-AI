import { Module } from '@nestjs/common';
import { TalendService } from './talend.service';
import { TalendController } from './talend.controller';
import { TalendConfigModule } from '../talend-config/talend-config.module';

@Module({
  imports: [TalendConfigModule],
  controllers: [TalendController],
  providers: [TalendService],
  exports: [TalendService],
})
export class TalendModule {}