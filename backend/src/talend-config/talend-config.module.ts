import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalendConfigService } from './talend-config.service';
import { TalendConfigController } from './talend-config.controller';
import { TalendConfig } from './entities/talend-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TalendConfig])],
  controllers: [TalendConfigController],
  providers: [TalendConfigService],
  exports: [TalendConfigService],
})
export class TalendConfigModule {}