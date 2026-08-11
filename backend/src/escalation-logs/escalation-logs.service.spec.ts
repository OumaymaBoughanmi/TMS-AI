import { Test, TestingModule } from '@nestjs/testing';
import { EscalationLogsService } from './escalation-logs.service';

describe('EscalationLogsService', () => {
  let service: EscalationLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EscalationLogsService],
    }).compile();

    service = module.get<EscalationLogsService>(EscalationLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
