import { Controller, Get, UseGuards } from '@nestjs/common';
import { TalendService } from './talend.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('talend')
export class TalendController {
  constructor(private readonly talendService: TalendService) {}

  @Get('tasks')
  getTasks() {
    return this.talendService.getTasks();
  }
}