import { Test, TestingModule } from '@nestjs/testing';
import { TalendConfigService } from './talend-config.service';

describe('TalendConfigService', () => {
  let service: TalendConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalendConfigService],
    }).compile();

    service = module.get<TalendConfigService>(TalendConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
