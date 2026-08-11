import { Controller, Get, UseGuards } from '@nestjs/common';
import { EscalationLogsService } from './escalation-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('escalation-logs')
export class EscalationLogsController {
  constructor(private readonly escalationLogsService: EscalationLogsService) {}

  @Get()
  findAll() {
    return this.escalationLogsService.findAll();
  }
}