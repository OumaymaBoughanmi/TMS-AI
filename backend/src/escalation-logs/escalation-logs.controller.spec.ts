import { Test, TestingModule } from '@nestjs/testing';
import { EscalationLogsController } from './escalation-logs.controller';
import { EscalationLogsService } from './escalation-logs.service';

describe('EscalationLogsController', () => {
  let controller: EscalationLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EscalationLogsController],
      providers: [EscalationLogsService],
    }).compile();

    controller = module.get<EscalationLogsController>(EscalationLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
