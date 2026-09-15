import { Test, TestingModule } from '@nestjs/testing';
import { TalendConfigController } from './talend-config.controller';
import { TalendConfigService } from './talend-config.service';

describe('TalendConfigController', () => {
  let controller: TalendConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalendConfigController],
      providers: [TalendConfigService],
    }).compile();

    controller = module.get<TalendConfigController>(TalendConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
