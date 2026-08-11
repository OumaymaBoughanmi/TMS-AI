import { Test, TestingModule } from '@nestjs/testing';
import { TalendService } from './talend.service';

describe('TalendService', () => {
  let service: TalendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalendService],
    }).compile();

    service = module.get<TalendService>(TalendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
