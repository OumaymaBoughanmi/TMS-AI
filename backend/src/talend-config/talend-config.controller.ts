import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TalendConfigService } from './talend-config.service';
import { CreateTalendConfigDto } from './dto/create-talend-config.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('talend-config')
export class TalendConfigController {
  constructor(private readonly talendConfigService: TalendConfigService) {}

  @Get()
  getConfig() {
    return this.talendConfigService.getActiveConfig();
  }

  @Post()
  saveConfig(@Body() dto: CreateTalendConfigDto) {
    return this.talendConfigService.saveConfig(dto);
  }
}