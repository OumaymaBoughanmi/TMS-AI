import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureController } from './infrastructure.controller';
import { InfrastructureService } from './infrastructure.service';

describe('InfrastructureController', () => {
  let controller: InfrastructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureController],
      providers: [InfrastructureService],
    }).compile();

    controller = module.get<InfrastructureController>(InfrastructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
